import { createFileRoute, Link} from '@tanstack/react-router'




import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

const UserProfile = () => {
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const parsedUserId = parseInt(userId, 10);
      if (isNaN(parsedUserId)) throw new Error('Invalid User ID');

      const response = await fetch(`http://localhost:3000/api/v1/users/${parsedUserId}`, {
        headers: {
          Authorization: 'Bearer pankix',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user');

      const user = await response.json();
      setUserData(user);
      setError('');
    } catch (err) {
      setError(err.message);
      setUserData(null);
    }
  };

  const handlePasswordChange = () => {
    // Implement password change logic
    console.log('Password change initiated');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex items-center mb-6">
            <input
              type="number"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border rounded-lg px-4 py-2 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            <button
              onClick={fetchUserData}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Load Profile
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {userData && (
            <div>
              {/* Profile Header */}
              <div className="flex items-center mb-8">
                <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center text-2xl mr-4">
                  {userData.firstname[0]}
                  {userData.lastname[0]}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {userData.firstname} {userData.lastname}
                  </h1>
                  <p className="text-gray-600">
                    Member since {new Date(userData.registered).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* User Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-4 text-gray-700">Account Details</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">User Role:</span> {userData.permissionId === 1 ? 'Member' : 'Administrator'}</p>
                    <p><span className="font-medium">Registration Date:</span> {new Date(userData.registered).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-4 text-gray-700">Contact Details</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Email:</span> {userData.email}</p>
                    <p><span className="font-medium">Phone:</span> {userData.phone}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4 flex-wrap">
                <button
                  onClick={handlePasswordChange}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Change Password
                </button>
                <Link to="/bookinghistory">
                <button
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  View Booking History
                </button>
                </Link>
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/UserProfile')({
  component: UserProfile,
})


export default UserProfile;