const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');

// Add a property to favorites
router.post('/', auth, async (req, res) => {
  const { propertyId } = req.body;
  try {
    let favorite = await Favorite.findOne({ user: req.user.id, property: propertyId });
    if (favorite) return res.status(400).json({ msg: 'Property already favorited' });
    favorite = new Favorite({ user: req.user.id, property: propertyId });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Remove a property from favorites
router.delete('/:propertyId', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user.id, property: req.params.propertyId });
    if (!favorite) return res.status(404).json({ msg: 'Favorite not found' });
    await favorite.remove();
    res.json({ msg: 'Favorite removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Check if a property is favorited
router.get('/:propertyId', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user.id, property: req.params.propertyId });
    res.json({ isFavorited: !!favorite });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;