import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import axios from 'axios';

function SearchResults() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(9);
  const location = useLocation();
  const navigate = useNavigate();

  // Parse search parameters from URL
  const searchParams = new URLSearchParams(location.search);
  const filters = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add pagination parameters to the filters
        const queryParams = {
          ...filters,
          page: currentPage,
          limit: resultsPerPage
        };

        const response = await axios.get('/api/properties/search', { params: queryParams });
        setProperties(response.data.properties);
        setTotalResults(response.data.total);
      } catch (err) {
        setError('Failed to fetch properties. Please try again later.');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters, currentPage, resultsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format filter values for display
  const formatFilterValue = (key, value) => {
    switch (key) {
      case 'propertyType':
        return value.charAt(0).toUpperCase() + value.slice(1);
      case 'minPrice':
        return `Min: $${Number(value).toLocaleString()}`;
      case 'maxPrice':
        return `Max: $${Number(value).toLocaleString()}`;
      case 'sortBy':
        return value.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      default:
        return value;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      
      {/* Filters Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Current Filters:</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear All Filters
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(filters)
            .filter(([key, value]) => value && key !== 'page' && key !== 'limit')
            .map(([key, value]) => (
              <span key={key} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {key}: {formatFilterValue(key, value)}
              </span>
            ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-4">
        Found {totalResults} {totalResults === 1 ? 'property' : 'properties'}
      </p>

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Search
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchResults; 