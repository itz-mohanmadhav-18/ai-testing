import axios from 'axios';
import { useEffect, useState } from 'react';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setNotifications(response.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    if (user) fetchNotifications();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-600">No new notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification._id} className="border-b pb-2">
              <p className="text-sm text-gray-700">{notification.message}</p>
              <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;