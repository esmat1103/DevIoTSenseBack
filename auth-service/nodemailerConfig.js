const nodemailer = require('nodemailer');

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendResetPasswordVerificationEmail = (email, resetToken) => {
  transport.sendMail({
    from: user,
    to: email,
    subject: 'Password Reset Request for Smart Innovation',
    html: `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
        <h1 style="color: #5D69F3;">🔒 Password Reset Request</h1>
        <p>Dear User,</p>
        <p>
          We have received a request to reset your password for your Smart Innovation account. If you initiated this request, please click the button below to reset your password.
        </p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="http://localhost:3001/ResetPasswordPage?token=${resetToken}" style="background-color: #5D69F3; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset My Password</a>
        </p>
        <p>
          If you did not request this password reset, please disregard this email. Your password will remain unchanged.
        </p>
        <p>
          Best regards,<br>
          The Smart Innovation Team
        </p>
      </div>
    `,
  }).catch((err) => console.error('Error sending password reset email:', err));
};