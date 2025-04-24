import axios from 'axios';
import { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyForm from '../components/PropertyForm';

function LandlordDashboard() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/properties', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // Filter properties for the current landlord
        const landlordProperties = response.data.filter((p) => p.landlord === user.id);
        setProperties(landlordProperties);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to fetch properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchProperties();
    }
  }, [user]);

  const handleAddProperty = async (formData) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/properties',
        formData,
        {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Add the new property to the beginning of the list
      setProperties(prevProperties => [response.data, ...prevProperties]);
      setShowForm(false);
      
      // Show success message
      alert('Property added successfully!');
    } catch (err) {
      console.error('Error adding property:', err);
      alert('Failed to add property. Please try again.');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      
      // Remove the deleted property from the list
      setProperties(prevProperties => 
        prevProperties.filter(property => property._id !== propertyId)
      );
      
      alert('Property deleted successfully!');
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property. Please try again.');
    }
  };

  if (!user || !user.token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600 text-xl">Please login to view your properties</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {showForm ? 'Cancel' : 'Add New Property'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Add New Property</h2>
          <PropertyForm onSubmit={handleAddProperty} />
        </div>
      )}

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
          <p className="text-gray-500 mb-4">Start by adding your first property</p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Add Property
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard 
              key={property._id} 
              property={property} 
              isLandlord 
              onDelete={() => handleDeleteProperty(property._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LandlordDashboard;