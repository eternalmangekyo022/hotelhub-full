import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '@/store';
import "./styles/userprofile.scss";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [user] = useAtom(userAtom); // Get logged-in user

  useEffect(() => {
    if (!user?.id) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${user.id}`, {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch user');

        const userData = await response.json();
        setUserData(userData);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handlePasswordChange = () => {
    console.log('Password change initiated');
  };

  if (loading) return <p className="loading-message">Loading profile...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="user-profile">
      <div className="profile-container">
        <div className="profile-card">
          {userData && (
            <div>
              <div className="user-header">
                <div className="avatar">
                  {userData.firstname[0]}{userData.lastname[0]}
                </div>
                <div>
                  <h1 className="user-name">
                    {userData.firstname} {userData.lastname}
                  </h1>
                  <p className="user-joined">
                    Member since {new Date(userData.registered).toLocaleDateString()}
                  </p>
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
