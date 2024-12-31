const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.get('/health-check', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

router.get('/about', (req, res) => {
  res.send('About Page');
});


module.exports = router;