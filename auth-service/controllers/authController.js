const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
require('dotenv').config();
const User = require('../models/AuthUser');
const Token = require('../models/Token');
const { sendResetPasswordVerificationEmail } = require('../nodemailerConfig');
const { wss } = require('../server'); 
const USERSERVICE_URL = 'http://userservice:3008';

const { JWT_SECRET } = process.env;


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const response = await axios.get(`${USERSERVICE_URL}/users/email/${email}`);
    const user = response.data;

    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.subscription_status) {
      console.log('Subscription inactive for user:', email);
      return res.status(403).json({ message: 'Subscription inactive. Please renew to log in.' });
    }

    let authUser = await User.findOne({ email });
    if (!authUser) {
      authUser = new User({
        email: user.email,
        password: user.password,
        role: user.role,
        subscription_status: user.subscription_status,
      });
      await authUser.save();
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password.trim());

    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        userName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        userId: user._id,
        email: user.email,
        role: user.role,
        subscription_status: user.subscription_status 
      },
      JWT_SECRET,
      { expiresIn: '7h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: 'Token is missing' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (verifyError) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const email = decoded.email;

    try {
      await axios.put(`${USERSERVICE_URL}/users/email/${email}/password`, { newPassword });
    } catch (error) {
      console.error('Error updating password in userservice:', error);
      return res.status(404).json({ message: 'Failed to update password in userservice' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });


    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    await Token.create({
      token: verificationToken,
      email,
      expiresAt: new Date(Date.now() + 3600000), 
    });

    await sendResetPasswordVerificationEmail(email, verificationToken);


    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
