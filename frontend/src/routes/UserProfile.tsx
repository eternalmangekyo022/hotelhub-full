import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import "./styles/userprofile.scss";

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
    console.log('Password change initiated');
  };

  return (
    <div className="user-profile">
      <div className="profile-container">
        <div className="profile-card">
          <div className="input-section">
            <input
              type="number"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="input-field"
              min="1"
            />
            <button onClick={fetchUserData} className="load-button">
              Load Profile
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          {userData && (
            <div>
              <div className="user-header">
                <div className="avatar">{userData.firstname[0]}{userData.lastname[0]}</div>
                <div>
                  <h1 className="user-name">{userData.firstname} {userData.lastname}</h1>
                  <p className="user-joined">Member since {new Date(userData.registered).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="info-card">
                <h2>Account Details</h2>
                <p><span>User Role:</span> {userData.permissionId === 1 ? 'Member' : 'Administrator'}</p>
                <p><span>Registration Date:</span> {new Date(userData.registered).toLocaleDateString()}</p>
              </div>

              <div className="info-card">
                <h2>Contact Details</h2>
                <p><span>Email:</span> {userData.email}</p>
                <p><span>Phone:</span> {userData.phone}</p>
              </div>

              <div className="button-group">
                <button onClick={handlePasswordChange} className="password-button">
                  Change Password
                </button>
                <Link to="/bookinghistory">
                  <button className="history-button">View Booking History</button>
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
});

export default UserProfile;
