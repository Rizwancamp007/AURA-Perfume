import crypto from 'crypto';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

// Helper to set httpOnly Cookie for Refresh Token
const setRefreshTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  res.cookie('refreshToken', token, cookieOptions);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user schema
    user.refreshTokens = [refreshToken];
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password +failedLoginAttempts +lockUntil +refreshTokens');

    if (!user) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    // Check account lockout
    if (user.isLocked()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      res.status(423);
      return next(new Error(`Account locked due to consecutive failures. Try again in ${remainingTime} minutes.`));
    }

    // Match Password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment failed logins
      user.failedLoginAttempts += 1;
      
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 mins
        await user.save();
        res.status(423);
        return next(new Error('Too many failed attempts. Account locked for 15 minutes.'));
      }

      await user.save();
      const attemptsLeft = 5 - user.failedLoginAttempts;
      res.status(401);
      return next(new Error(`Invalid credentials. ${attemptsLeft} attempts remaining.`));
    }

    // Login successful - reset lockout parameters
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;

    // Check if Two-Factor Authentication is enabled
    if (user.twoFactorEnabled) {
      // Generate temporary 2FA token
      const tempToken = jwt.sign({ id: user._id, type: '2fa_pending' }, process.env.JWT_SECRET, {
        expiresIn: '5m' // 5 minutes
      });
      await user.save();

      return res.status(200).json({
        success: true,
        require2FA: true,
        tempToken,
        message: '2FA authentication code required'
      });
    }

    // Standard Login flow
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Append to active refresh tokens
    user.refreshTokens.push(refreshToken);
    // Keep max 5 active session devices
    if (user.refreshTokens.length > 5) {
      user.refreshTokens.shift();
    }
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify 2FA login code
// @route   POST /api/auth/verify-2fa
// @access  Public (Requires temp token)
export const verify2FALogin = async (req, res, next) => {
  const { tempToken, code } = req.body;

  try {
    if (!tempToken || !code) {
      res.status(400);
      return next(new Error('Temp token and 2FA code are required'));
    }

    // Verify temp token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    if (decoded.type !== '2fa_pending') {
      res.status(401);
      return next(new Error('Invalid token session'));
    }

    const user = await User.findById(decoded.id).select('+twoFactorSecret +refreshTokens');
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    // Verify TOTP code
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1 // 30-sec buffer before and after
    });

    if (!verified) {
      res.status(401);
      return next(new Error('Invalid verification code'));
    }

    // Valid 2FA -> Issue Session
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push(refreshToken);
    if (user.refreshTokens.length > 5) {
      user.refreshTokens.shift();
    }
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      }
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401);
      return next(new Error('Session expired, please log in again'));
    }
    next(error);
  }
};

// @desc    Setup Admin 2FA (Generate Secret & QR Code)
// @route   POST /api/auth/2fa/setup
// @access  Private
export const setup2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+twoFactorSecret');

    if (user.twoFactorEnabled) {
      res.status(400);
      return next(new Error('2FA is already setup and enabled'));
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `AURA: ${user.email}`
    });

    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate QR Code URL
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.status(200).json({
      success: true,
      secret: secret.base32,
      qrCodeUrl
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify 2FA setup and enable
// @route   POST /api/auth/2fa/verify
// @access  Private
export const verify2FASetup = async (req, res, next) => {
  const { code } = req.body;

  try {
    const user = await User.findById(req.user._id).select('+twoFactorSecret');

    if (!user.twoFactorSecret) {
      res.status(400);
      return next(new Error('Setup has not been initiated'));
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    if (!verified) {
      res.status(400);
      return next(new Error('Verification failed. Code is invalid.'));
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Two-Factor Authentication is enabled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Disable 2FA
// @route   POST /api/auth/2fa/disable
// @access  Private
export const disable2FA = async (req, res, next) => {
  const { code } = req.body;

  try {
    const user = await User.findById(req.user._id).select('+twoFactorSecret');

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    if (!verified) {
      res.status(400);
      return next(new Error('Invalid 2FA code'));
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Two-Factor Authentication is disabled'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401);
    return next(new Error('No refresh token, access denied'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshTokens');

    if (!user || !user.refreshTokens.includes(token)) {
      res.status(401);
      return next(new Error('Token is invalid or has been revoked'));
    }

    const accessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    res.status(401);
    return next(new Error('Token expired or validation failed'));
  }
};

// @desc    Logout user & invalidate tokens
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res, next) => {
  const token = req.cookies.refreshToken;

  try {
    if (token) {
      // Find user and remove this device's token
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { refreshTokens: token } }
      );
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // For security, do not disclose if email is registered. Return success immediately.
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If the email matches an account, a reset link will be sent.'
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and save in DB
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins validity
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const html = `
      <h3 style="color: #C9A96E; font-weight: 300;">Password Reset Request</h3>
      <p>We received a request to reset the password associated with your account.</p>
      <p>Please click the button below to secure a new password. This link is valid for 15 minutes.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #C9A96E; color: #0A0A0F; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Reset Password</a>
      </div>
      <p style="font-size: 13px; color: #A89B8C;">If you did not request this reset, please ignore this email. Your current credentials remain secure.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Recovery Invitation — AURA',
        text: `You are receiving this email because you requested a password reset. Reset link: ${resetUrl}`,
        html
      });

      res.status(200).json({
        success: true,
        message: 'If the email matches an account, a reset link will be sent.'
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(500);
      return next(new Error('Email could not be sent. Please try again.'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  const token = req.params.token;

  try {
    // Hash token to match database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      return next(new Error('Reset token is invalid or has expired'));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Invalidate all active sessions for security on password change
    user.refreshTokens = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. Please log in with your new credentials.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  const { name, phone, addresses } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (addresses) user.addresses = addresses;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        addresses: updatedUser.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};
