import axios from 'axios';
import { useEffect, useState } from 'react';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferences: user?.preferences || { locations: [], budget: '' },
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!user) window.location.href = '/login';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:5000/api/auth/profile',
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setStatus('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
    } catch (err) {
      setStatus('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Locations</label>
            <input
              type="text"
              name="locations"
              value={formData.preferences.locations}
              onChange={handlePreferenceChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="e.g., Bangalore, Mumbai"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget (₹)</label>
            <input
              type="number"
              name="budget"
              value={formData.preferences.budget}
              onChange={handlePreferenceChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Update Profile
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
}

export default Profile;