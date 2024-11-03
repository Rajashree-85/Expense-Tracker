// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  User.create(email, hashedPassword, (err) => {
    if (err) return res.status(400).json({ message: 'User already exists' });
    res.status(201).json({ message: 'User created' });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, user) => {
    if (err || !user) return res.status(404).json({ message: 'User not found' });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: 86400 });
    res.status(200).json({ token });
  });
});

module.exports = router;