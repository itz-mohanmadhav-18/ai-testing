const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Search properties with filters
router.get('/search', async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      propertyType,
      bedrooms,
      bathrooms,
      amenities,
      sortBy,
      page = 1,
      limit = 9
    } = req.query;

    // Build the query object
    const query = {};

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    if (bathrooms) {
      query.bathrooms = Number(bathrooms);
    }

    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $all: amenitiesArray };
    }

    // Build the sort object
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          sort.price = 1;
          break;
        case 'price-desc':
          sort.price = -1;
          break;
        case 'newest':
          sort.createdAt = -1;
          break;
        case 'oldest':
          sort.createdAt = 1;
          break;
        default:
          sort.createdAt = -1;
      }
    } else {
      sort.createdAt = -1;
    }

    // Get total count of matching properties
    const total = await Property.countDocuments(query);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Find properties with pagination
    const properties = await Property.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('owner', 'name email');

    res.json({
      properties,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ message: 'Error searching properties' });
  }
});

// @route   POST /api/properties/upload
// @desc    Upload property images
// @access  Private (Landlord)
router.post('/upload', authMiddleware(['landlord']), upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const urls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ urls });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Error uploading images' });
  }
});

// @route   POST /api/properties/verify-document
// @desc    Upload and verify property document
// @access  Private (Landlord)
router.post('/verify-document', authMiddleware(['landlord']), upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document uploaded' });
    }

    // Here you would typically verify the document
    // For now, we'll just return the URL
    const documentUrl = `/uploads/${req.file.filename}`;
    res.json({ documentUrl });
  } catch (error) {
    console.error('Error verifying document:', error);
    res.status(500).json({ message: 'Error verifying document' });
  }
});

// @route   POST /api/properties
// @desc    Create a new property
// @access  Private (Landlord)
router.post('/', authMiddleware(['landlord']), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      propertyType,
      size,
      amenities,
      images,
      document
    } = req.body;

    // Validate required fields
    if (!title || !price || !location || !propertyType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create new property
    const newProperty = new Property({
      title,
      description,
      price: Number(price),
      location,
      propertyType,
      size: Number(size),
      amenities: amenities || [],
      images: images || [],
      document,
      landlord: req.user.id
    });

    // Save property to database
    const savedProperty = await newProperty.save();

    // Populate landlord information
    await savedProperty.populate('landlord', 'name email');

    res.status(201).json(savedProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Error creating property' });
  }
});

// @route   GET /api/properties
// @desc    Get all properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().populate('landlord', 'name email');
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

// @route   GET /api/properties/:id
// @desc    Get property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('landlord', 'name email');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property' });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update a property
// @access  Private (Landlord, Admin)
router.put('/:id', authMiddleware(['landlord', 'admin']), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is authorized to update this property
    if (req.user.role !== 'admin' && property.landlord.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('landlord', 'name email');

    res.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Error updating property' });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a property
// @access  Private (Landlord, Admin)
router.delete('/:id', authMiddleware(['landlord', 'admin']), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is authorized to delete this property
    if (req.user.role !== 'admin' && property.landlord.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await property.remove();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Error deleting property' });
  }
});

module.exports = router; 