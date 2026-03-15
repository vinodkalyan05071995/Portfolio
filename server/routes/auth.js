const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router();

router.post('/login', (req, res) => {
    const { password } = req.body;

    if (!password || password !== config.DASHBOARD_PASSWORD) {
        return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign({ user: 'admin' }, config.AUTH_SECRET, { expiresIn: '24h' });
    res.json({ token });
});

module.exports = router;
