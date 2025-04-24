import { Link } from 'react-router-dom';

function PropertyCard({ property, isLandlord, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Property Image */}
      <div className="relative h-48">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        {property.verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            Verified
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
          <span className="text-lg font-bold text-blue-600">
            ₹{property.price.toLocaleString()}
          </span>
        </div>

        <p className="text-gray-600 mb-2">{property.location}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="mr-4">{property.propertyType}</span>
          {property.size && <span>{property.size} sqft</span>}
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities.map((amenity, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Link
            to={`/property/${property._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details
          </Link>
          
          {isLandlord && (
            <div className="flex space-x-2">
              <Link
                to={`/properties/${property._id}/edit`}
                className="text-gray-600 hover:text-gray-800"
              >
                Edit
              </Link>
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
