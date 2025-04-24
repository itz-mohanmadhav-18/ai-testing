import axios from 'axios';
import { useState } from 'react';

function PropertyForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: '',
    size: '',
    amenities: [],
    images: [],
    document: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, value] : prev.amenities.filter((a) => a !== value),
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:5000/api/properties/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
        },
      });
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...response.data.urls] }));
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('document', file);

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:5000/api/properties/verify-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
        },
      });
      setFormData((prev) => ({ ...prev, document: response.data.documentUrl }));
    } catch (err) {
      console.error('Document verification failed:', err);
      setError('Failed to verify document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows="4"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Property Type</label>
        <select
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Type</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Size (sqft)</label>
        <input
          type="number"
          name="size"
          value={formData.size}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Amenities</label>
        <div className="mt-1 flex flex-wrap gap-4">
          {['Parking', 'Lift', 'Gym', 'Pool', 'Security', 'Garden'].map((amenity) => (
            <label key={amenity} className="inline-flex items-center">
              <input
                type="checkbox"
                value={amenity}
                checked={formData.amenities.includes(amenity)}
                onChange={handleAmenityChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="mt-1 block w-full text-sm text-gray-500"
          accept="image/*"
        />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {formData.images.map((url, index) => (
            <img key={index} src={url} alt="Property" className="h-20 w-full object-cover rounded" />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Property Document</label>
        <input
          type="file"
          onChange={handleDocumentUpload}
          className="mt-1 block w-full text-sm text-gray-500"
          accept=".pdf,.doc,.docx"
        />
        {formData.document && (
          <p className="mt-1 text-sm text-green-600">Document uploaded successfully</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Add Property'}
      </button>
    </form>
  );
}

export default PropertyForm;