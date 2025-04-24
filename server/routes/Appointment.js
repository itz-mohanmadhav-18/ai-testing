const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

// Create a new appointment
router.post('/', auth, async (req, res) => {
  const { propertyId, date } = req.body;
  try {
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ msg: 'Property not found' });
    const appointment = new Appointment({
      user: req.user.id,
      property: propertyId,
      landlord: property.landlord,
      date,
    });
    await appointment.save();
    // Notify landlord
    await new Notification({
      user: property.landlord,
      message: `New appointment requested for ${property.title} on ${new Date(date).toLocaleString()}`,
      type: 'appointment',
    }).save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all appointments for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [{ user: req.user.id }, { landlord: req.user.id }],
    })
      .populate('property', 'title')
      .populate('user', 'name')
      .populate('landlord', 'name');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update appointment status (e.g., confirm)
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
    if (appointment.landlord.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    appointment.status = status;
    await appointment.save();
    // Notify user
    await new Notification({
      user: appointment.user,
      message: `Your appointment for ${appointment.property.title} has been ${status}`,
      type: 'appointment',
    }).save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;