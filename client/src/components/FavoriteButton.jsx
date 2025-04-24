import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';

function FavoriteButton({ propertyId }) {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axios.get(`http://localhost:5000/api/favorites/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorited(response.data.isFavorited);
      } catch (err) {
        console.error('Error checking favorite:', err);
      }
    };
    checkFavorite();
  }, [propertyId]);

  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to favorite properties');
        return;
      }
      if (isFavorited) {
        await axios.delete(`http://localhost:5000/api/favorites/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          'http://localhost:5000/api/favorites',
          { propertyId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Failed to update favorite');
    }
  };

  return (
    <button onClick={handleFavorite} className="focus:outline-none">
      {isFavorited ? (
        <HeartSolid className="h-6 w-6 text-red-500" />
      ) : (
        <HeartOutline className="h-6 w-6 text-gray-500" />
      )}
    </button>
  );
}

export default FavoriteButton;