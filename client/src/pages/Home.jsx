import { HomeIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';

function Home() {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/properties');
        const allProperties = response.data;
        setProperties(allProperties);
        setFeaturedProperties(allProperties.slice(0, 3));
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/properties', { params: filters });
      setProperties(response.data);
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Adorable Logo */}
      <section
        className="relative bg-cover bg-center h-[500px] flex items-center justify-center text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center mb-4">
            <HomeIcon className="w-10 h-10 text-peach-400 mr-2" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-white font-pacifico bg-gradient-to-r from-peach-400 to-pink-400 bg-clip-text text-transparent animate-bounce-in">
              Cozy Corner
            </h1>
          </div>
          <p className="text-lg md:text-xl mb-6 animate-fade-in-up">
            Explore thousands of verified properties across India
          </p>
          <button
            onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
            className="bg-peach-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-peach-600 transition duration-300"
            aria-label="Start searching for properties"
          >
            Start Your Search
          </button>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Properties</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} isFeatured={true} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No featured properties available.</p>
        )}
      </section>

      {/* All Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Explore All Properties</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No properties found. Try adjusting your search filters.</p>
        )}
      </section>

      {/* Popular Cities */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Browse by Popular Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Mumbai', 'Delhi', 'Bangalore', 'Pune'].map((city) => (
              <button
                key={city}
                onClick={() => handleSearch({ location: city })}
                className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-blue-50 hover:shadow-lg transition duration-300"
                aria-label={`Search properties in ${city}`}
              >
                <h3 className="text-lg font-semibold text-gray-800">{city}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Choose Cozy Corner?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-peach-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Verified Listings</h3>
            <p className="text-gray-600">All properties are thoroughly verified for authenticity.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-peach-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Trusted Landlords</h3>
            <p className="text-gray-600">Connect with reliable landlords across India.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-peach-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Support</h3>
            <p className="text-gray-600">Get quick assistance from our dedicated team.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;