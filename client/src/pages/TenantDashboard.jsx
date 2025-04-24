import axios from 'axios';
import { useEffect, useState } from 'react';
import Notification from '../components/Notification';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';

function TenantDashboard() {
  const [properties, setProperties] = useState([]);
  const [recommended, setRecommended] = useState([]);

  const fetchProperties = async (filters = {}) => {
    try {
      const response = await axios.get('http://localhost:5000/api/properties', { params: filters });
      setProperties(response.data);
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/properties/recommend', {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` },
      });
      setRecommended(response.data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchRecommendations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Perfect Home</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <SearchBar onSearch={fetchProperties} />
          <h2 className="text-2xl font-semibold mt-8 mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">All Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
        <div>
          <Notification />
        </div>
      </div>
    </div>
  );
}

export default TenantDashboard;