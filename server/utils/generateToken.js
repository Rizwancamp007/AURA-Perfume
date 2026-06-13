import jwt from 'jsonwebtoken';

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.VITE_JWT_EXPIRES_IN || '15m',
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.VITE_JWT_REFRESH_EXPIRES_IN || '7d',
  });
};
export default { generateAccessToken, generateRefreshToken };
