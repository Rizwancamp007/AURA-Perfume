import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Branded luxury layout HTML wrapper
  const htmlContent = `
    <div style="background-color: #0A0A0F; color: #F5F0E8; font-family: 'DM Sans', Arial, sans-serif; padding: 40px 20px; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #12121A; border: 1px solid #C9A96E; border-radius: 8px; padding: 30px; text-align: left; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        
        <!-- Header Logo -->
        <div style="text-align: center; border-bottom: 1px solid rgba(201, 169, 110, 0.15); padding-bottom: 20px; margin-bottom: 25px;">
          <span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 300; letter-spacing: 0.15em; color: #C9A96E; text-transform: uppercase;">AURA</span>
          <div style="font-family: 'Great Vibes', cursive; font-size: 16px; color: #E8D5A3; margin-top: 5px;">Pure Artisanal Essence</div>
        </div>

        <!-- Body -->
        <div style="font-size: 16px; line-height: 1.6; color: #A89B8C; margin-bottom: 30px;">
          ${options.html}
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid rgba(201, 169, 110, 0.15); padding-top: 20px; font-size: 12px; color: #A89B8C;">
          <p style="margin: 0 0 10px;">This is an automated email from AURA. Please do not reply directly to this message.</p>
          <p style="margin: 0; color: #C9A96E; font-weight: bold;">AURA FRAGRANCES · KARACHI, PAKISTAN</p>
        </div>

      </div>
    </div>
  `;

  const mailOptions = {
    from: `"AURA Fragrances" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email Delivery Error:', error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
