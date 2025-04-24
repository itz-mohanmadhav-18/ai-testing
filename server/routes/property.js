const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const authMiddleware = require('../middleware/auth');

// Utility: Handle server errors
const handleServerError = (res, err) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};

// @route   GET /api/properties
// @desc    Get all properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().populate('landlord', 'name email phone');
    res.json(properties);
  } catch (err) {
    handleServerError(res, err);
  }
});

// @route   GET /api/properties/admin
// @desc    Get all properties (Admin only)
// @access  Admin
router.get('/admin', authMiddleware(['admin']), async (req, res) => {
  try {
    const properties = await Property.find().populate('landlord', 'name email phone');
    res.json(properties);
  } catch (err) {
    handleServerError(res, err);
  }
});

// @route   GET /api/properties/:id
// @desc    Get a property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('landlord', 'name email phone');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    handleServerError(res, err);
  }
});

// @route   PUT /api/properties/:id
// @desc    Update a property (Admin, Landlord)
// @access  Admin, Landlord
router.put('/:id', authMiddleware(['admin', 'landlord']), async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    handleServerError(res, err);
  }
});

// @route   PUT /api/properties/approve/:id
// @desc    Approve/verify a property (Admin only)
// @access  Admin
router.put('/approve/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const { verified } = req.body;
    if (typeof verified !== 'boolean') {
      return res.status(400).json({ message: 'Invalid or missing verified value (must be true or false)' });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { verified },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    handleServerError(res, err);
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a property (Admin, Landlord)
// @access  Admin, Landlord
router.delete('/:id', authMiddleware(['admin', 'landlord']), async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(204).json({ message: 'Property deleted' });
  } catch (err) {
    handleServerError(res, err);
  }
});

module.exports = router;
