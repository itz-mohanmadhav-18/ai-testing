import {
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EnvelopeIcon,
    PhoneIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/properties/${id}`
        );
        setProperty(response.data);
      } catch (err) {
        setError('Failed to load property details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleImageChange = (direction) => {
    if (!property?.images) return;
    if (direction === 'next') {
      setCurrentImage((prev) => (prev + 1) % property.images.length);
    } else {
      setCurrentImage(
        (prev) => (prev - 1 + property.images.length) % property.images.length
      );
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setFormError('All fields are required.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/contact', {
        ...contactForm,
        propertyId: id,
        landlordId: property.landlord._id,
      });
      setFormSuccess('Message sent successfully!');
      setContactForm({ name: '', email: '', message: '' });
      setFormError('');
    } catch (err) {
      setFormError('Failed to send message. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600 text-xl">{error || 'Property not found.'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back to Home
          </Link>
        </nav>

        {/* Hero Image Gallery */}
        <section className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img
              src={
                property.images?.[currentImage] ||
                'https://via.placeholder.com/800x400?text=Property+Image'
              }
              alt={property.title}
              className="w-full h-[400px] object-cover"
            />
            {property.images?.length > 1 && (
              <>
                <button
                  onClick={() => handleImageChange('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleImageChange('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}
            {property.verified && (
              <span className="absolute top-4 left-4 bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-1" /> Verified
              </span>
            )}
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <p className="text-lg text-gray-600 mt-2">{property.location}</p>
            <p className="text-2xl font-semibold text-blue-600 mt-2">
              ₹{property.price.toLocaleString('en-IN')} /mo
            </p>
          </div>
        </section>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Overview */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Property Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="text-lg font-medium text-gray-900">{property.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="text-lg font-medium text-gray-900">
                    {property.sqft || 'N/A'} sq.ft.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price per sq.ft.</p>
                  <p className="text-lg font-medium text-gray-900">
                    ₹
                    {property.sqft
                      ? Math.round(property.price / property.sqft).toLocaleString('en-IN')
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-medium text-gray-900">
                    {property.verified ? 'Verified' : 'Pending'}
                  </p>
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.length > 0 ? (
                  property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No amenities listed.</p>
                )}
              </div>
            </section>

            {/* Description */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700">
                {property.description ||
                  'This is a beautifully designed property located in the heart of the city, offering modern amenities and a comfortable living experience.'}
              </p>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">

            {/* Landlord Details */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Landlord Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 text-gray-600 mr-2" />
                  <p className="text-gray-700">{property.landlord?.email || 'N/A'}</p>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-gray-600 mr-2" />
                  <p className="text-gray-700">{property.landlord?.phone || 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Contact Form */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Landlord</h2>
              {formSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg" role="alert">
                  {formSuccess}
                </div>
              )}
              {formError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg" role="alert">
                  {formError}
                </div>
              )}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Your email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, message: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    aria-label="Your message"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                  aria-label="Send message to landlord"
                >
                  Send Message
                </button>
              </form>
            </section>

          </div>

        </div>

      </div>
    </div>
  );
}

export default PropertyDetail;
