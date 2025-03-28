import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { userAtom } from '@/store'
import './styles/userprofile.scss'
import axios from 'axios'

const UserProfile = () => {
  const [user] = useAtom(userAtom) // Get logged-in user
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handlePasswordChange = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setCurrentPassword('')
    setNewPassword('')
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Validate that the new password is different from the current password
    if (currentPassword === newPassword) {
      alert('New password cannot be the same as the current password.')
      return
    }

    if (!user) return
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/v1/users/${user.id}/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            'Content-Type': 'applicaton/json',
          },
          withCredentials: true,
        },
      )
      alert(data)
      handleModalClose()
    } catch (err) {
      alert(
        (err as { message: string }).message ||
          'An error occurred while changing the password.',
      )
    }
  }

  useEffect(() => {
    if (!user)
      redirect({
        to: '/Login',
        params: { redirect: encodeURIComponent('/userprofile') },
      })
  }, [])

  return (
    <div className="user-profile [*]:not-dark:text-black">
      <div className="profile-container">
        <div className="profile-card">
          {user && (
            <div>
              <div className="profile-header">
                <div className="avatar">
                  {user.firstname[0]}
                  {user.lastname[0]}
                </div>
                <div>
                  <h1 className="user-name">
                    {user.firstname} {user.lastname}
                  </h1>
                  <p className="user-joined">
                    Member since{' '}
                    {new Date(user.registered).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="info-card">
                <h2>Account Details</h2>
                <p>
                  <span>User Role:</span>{' '}
                  {(user as any).permissionId === '1'
                    ? 'Member'
                    : 'Administrator'}
                </p>
                <p>
                  <span>Registration Date:</span>{' '}
                  {new Date(user.registered).toLocaleDateString()}
                </p>
              </div>

              <div className="info-card">
                <h2>Contact Details</h2>
                <p>
                  <span>Email:</span> {user.email}
                </p>
                <p>
                  <span>Phone:</span> {user.phone}
                </p>
              </div>

              <div className="button-group">
                <button
                  onClick={handlePasswordChange}
                  className="password-button"
                >
                  Change Password
                </button>
                <Link to="/BookingHistory">
                  <button className="history-button">
                    View Booking History
                  </button>
                </Link>
              </div>

              {isModalOpen && (
                <div className="modal-overlay [*]:not-dark:text-black">
                  <div className="modal">
                    <h2>Change Password</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="currentPassword">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="button-group">
                        <button
                          type="button"
                          onClick={handleModalClose}
                          className="cancel-button"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="submit-button">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/UserProfile')({
  component: UserProfile,
})

export default UserProfile
