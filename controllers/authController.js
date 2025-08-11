const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    console.log('Register handler started');
    let { username, email, password, confirmPassword } = req.body;
    console.log('Request body:', req.body);

    if (!username && email) {
      username = email.split('@')[0];
    }

    if (!email || !password || !confirmPassword) {
      console.log('Missing fields');
      return res.status(400).json({ message: 'Email, password, and confirm password are required' });
    }

    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    console.log('Checking for existing user');
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    console.log('Existing user:', existingUser);

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    const newUser = new User({ username, email, password: hashedPassword });
    console.log('Saving new user');
    await newUser.save();
    console.log('User saved');

    res.status(201).json({
      message: 'User registered successfully',
      user: { username, email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res.status(400).json({ message: 'Email/Username and password are required' });
    }

    // Find user by email or username
    const user = email
      ? await User.findOne({ email })
      : await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`✅ User logged in: ${user.username} (${user.email})`);

    res.status(200).json({
      message: 'Login successful',
      user: { username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
