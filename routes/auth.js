const express = require('express');
const passport = require('passport');
const router = express.Router();

console.log('Auth routes loaded');

const { login, register } = require('../controllers/authController');

// Local Auth Routes
router.post('/login', login);
router.post('/register', register);

router.get('/ping', (req, res) => {
  console.log('Ping route hit');
  res.send('pong');
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('https://code-arena-three.vercel.app/dashboard')
);

// GitHub OAuth
router.get('/github', passport.authenticate('github'));
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => res.redirect('https://code-arena-three.vercel.app/dashboard')
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Get Current Authenticated User
router.get('/user', (req, res) => {
  res.send(req.user);
});

module.exports = router;
