const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const authMiddleware = require('../middleware/auth');

// Get all appointments (admin only)
router.get('/', authMiddleware(['admin']), async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('property user');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;