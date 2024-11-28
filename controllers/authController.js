const SignIn = require('../models/authModel');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '1h',
  });
};

const signinController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await SignIn.findOne({ username });
    if (!user) {
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      status: true,
      message: 'Login successful',
      data: { token, user: { id: user._id, username: user.username } },
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ status: false, message: 'Server error', error: error.message });
  }
};

const signupController = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: false, message: 'Username and password are required' });
  }

  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ status: false, message: 'Username must be between 3 and 30 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ status: false, message: 'Password must be at least 6 characters long' });
  }

  try {
    const existingUser = await SignIn.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ status: false, message: 'Username already exists' });
    }

    const newUser = new SignIn({ username, password });
    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      status: true,
      message: 'User registered successfully',
      data: {
        token,
        user: { id: newUser._id, username: newUser.username },
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      status: false,
      message: 'An error occurred during registration',
      error: error.message,
    });
  }
};

module.exports = { signinController, signupController };
