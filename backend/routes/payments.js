const express = require('express');
const router = express.Router();

// Mock payment verification endpoint
router.post('/verify', (req, res) => {
  const { reference } = req.body;
  res.json({
    message: `Payment with reference ${reference} verified successfully`,
    status: 'success'
  });
});

module.exports = router;
