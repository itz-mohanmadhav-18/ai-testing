import { Tab } from '@headlessui/react';
import { CheckCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalProperties: 0, pendingApprovals: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editProperty, setEditProperty] = useState(null);
  const [notification, setNotification] = useState({ message: '', userId: '' });
  const [userSearch, setUserSearch] = useState('');
  const [propertySearch, setPropertySearch] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'admin') return;
      setLoading(true);
      try {
        const [usersResponse, propertiesResponse, appointmentsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/auth/users', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get('http://localhost:5000/api/properties/admin', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get('http://localhost:5000/api/appointments', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
        setUsers(usersResponse.data);
        setProperties(propertiesResponse.data);
        setAppointments(appointmentsResponse.data);
        setStats({
          totalUsers: usersResponse.data.length,
          totalProperties: propertiesResponse.data.length,
          pendingApprovals: propertiesResponse.data.filter((p) => !p.verified).length,
        });
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // User Management
  const handleEditUser = async (userId) => {
    const userToEdit = users.find((u) => u._id === userId);
    setEditUser({ ...userToEdit });
  };

  const handleSaveUser = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/auth/users/${editUser._id}`,
        { name: editUser.name, email: editUser.email, role: editUser.role },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setUsers(users.map((u) => (u._id === editUser._id ? editUser : u)));
      setEditUser(null);
      setSuccess('User updated successfully.');
    } catch (err) {
      setError('Failed to update user.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter((u) => u._id !== userId));
      setSuccess('User deleted successfully.');
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  // Property Management
  const handleEditProperty = (propertyId) => {
    const propertyToEdit = properties.find((p) => p._id === propertyId);
    setEditProperty({ ...propertyToEdit });
  };

  const handleSaveProperty = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/properties/${editProperty._id}`,
        editProperty,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProperties(properties.map((p) => (p._id === editProperty._id ? editProperty : p)));
      setEditProperty(null);
      setSuccess('Property updated successfully.');
    } catch (err) {
      setError('Failed to update property.');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProperties(properties.filter((p) => p._id !== propertyId));
      setSuccess('Property deleted successfully.');
    } catch (err) {
      setError('Failed to delete property.');
    }
  };

  const handleApproveProperty = async (propertyId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/properties/approve/${propertyId}`,
        { verified: true },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProperties(properties.map((p) => (p._id === propertyId ? { ...p, verified: true } : p)));
      setSuccess('Property approved successfully.');
    } catch (err) {
      setError('Failed to approve property.');
    }
  };

  // Notification
  const handleSendNotification = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/notifications',
        { userId: notification.userId, message: notification.message },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNotification({ message: '', userId: '' });
      setSuccess('Notification sent successfully.');
    } catch (err) {
      setError('Failed to send notification.');
    }
  };

  // Filtered Data
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
      p.location.toLowerCase().includes(propertySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg" role="alert">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg" role="alert">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Properties</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalProperties}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.pendingApprovals}</p>
          </div>
        </div>

        {/* Tabbed Interface */}
        <Tab.Group>
          <Tab.List className="flex space-x-1 bg-blue-600 rounded-lg p-1 mb-8">
            {['Users', 'Properties', 'Appointments', 'Notifications'].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `w-full py-2.5 text-sm font-medium text-white rounded-lg ${
                    selected ? 'bg-blue-800' : 'hover:bg-blue-700'
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {/* Users Tab */}
            <Tab.Panel>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search users by name, email, or role"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  aria-label="Search users"
                />
              </div>
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : filteredUsers.length > 0 ? (
                <ul className="space-y-4">
                  {filteredUsers.map((u) => (
                    <li key={u._id} className="bg-white shadow p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-700">Name: {u.name}</p>
                        <p className="text-sm text-gray-700">Email: {u.email}</p>
                        <p className="text-sm text-gray-700">Role: {u.role}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(u._id)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label={`Edit user ${u.name}`}
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Delete user ${u.name}`}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-center">No users found.</p>
              )}
            </Tab.Panel>

            {/* Properties Tab */}
            <Tab.Panel>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search properties by title or location"
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  aria-label="Search properties"
                />
              </div>
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : filteredProperties.length > 0 ? (
                <ul className="space-y-4">
                  {filteredProperties.map((p) => (
                    <li key={p._id} className="bg-white shadow p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-700">Title: {p.title}</p>
                        <p className="text-sm text-gray-700">Location: {p.location}</p>
                        <p className="text-sm text-gray-700">Price: ₹{p.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-700">Status: {p.verified ? 'Approved' : 'Pending'}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProperty(p._id)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label={`Edit property ${p.title}`}
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        {!p.verified && (
                          <button
                            onClick={() => handleApproveProperty(p._id)}
                            className="text-green-600 hover:text-green-800"
                            aria-label={`Approve property ${p.title}`}
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteProperty(p._id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Delete property ${p.title}`}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-center">No properties found.</p>
              )}
            </Tab.Panel>

            {/* Appointments Tab */}
            <Tab.Panel>
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : appointments.length > 0 ? (
                <ul className="space-y-4">
                  {appointments.map((a) => (
                    <li key={a._id} className="bg-white shadow p-4 rounded-lg">
                      <p className="text-sm text-gray-700">Property: {a.property.title}</p>
                      <p className="text-sm text-gray-700">User: {a.user.name}</p>
                      <p className="text-sm text-gray-700">Date: {new Date(a.date).toLocaleString()}</p>
                      <p className="text-sm text-gray-700">Status: {a.status}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-center">No appointments found.</p>
              )}
            </Tab.Panel>

            {/* Notifications Tab */}
            <Tab.Panel>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Send Notification</h2>
                <div className="space-y-4">
                  <select
                    value={notification.userId}
                    onChange={(e) => setNotification({ ...notification, userId: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Select user for notification"
                  >
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={notification.message}
                    onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                    placeholder="Enter notification message"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    aria-label="Notification message"
                  ></textarea>
                  <button
                    onClick={handleSendNotification}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    disabled={!notification.userId || !notification.message}
                    aria-label="Send notification"
                  >
                    Send Notification
                  </button>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Edit User Modal */}
        {editUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editUser.name}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={editUser.role}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tenant">Tenant</option>
                    <option value="landlord">Landlord</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleSaveUser}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditUser(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Property Modal */}
        {editProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4">Edit Property</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={editProperty.title}
                    onChange={(e) => setEditProperty({ ...editProperty, title: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={editProperty.location}
                    onChange={(e) => setEditProperty({ ...editProperty, location: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    value={editProperty.price}
                    onChange={(e) => setEditProperty({ ...editProperty, price: Number(e.target.value) })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleSaveProperty}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditProperty(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;