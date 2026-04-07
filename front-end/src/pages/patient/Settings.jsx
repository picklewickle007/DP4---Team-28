//Sets up patient settings page's front-end 
//Import statements imports data storing tools from react
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function PatientSettings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    age: '',
    address: '',
    current_password: '',
  });
//Reusable style objects
  const lineStyle = {
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: '#547aad',
    width: '70%',
    marginLeft: '80px',
    marginTop: '0',
    marginBottom: '0',
  };

  const buttonStyle = {
    backgroundColor: '#5f87bd',
    border: '1px solid #7fa0cb',
    textAlign: 'left',
    width: '70%',
    cursor: 'pointer',
    marginLeft: '80px',
    display: 'block',
    color: 'white',
    padding: '24px 32px',
    borderRadius: '18px',
    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
  };

  const profileCardStyle = {
    width: '70%',
    marginLeft: '80px',
    backgroundColor: '#263447',
    border: '1px solid #547aad',
    borderRadius: '18px',
    padding: '24px 32px',
    color: 'white',
    boxSizing: 'border-box',
  };

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '18px',
  };

  const profileRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #7fa0cb',
    backgroundColor: '#1d2835',
    color: 'white',
    fontSize: '18px',
    boxSizing: 'border-box',
    marginTop: '8px',
  };

  const editLinkStyle = {
    background: 'none',
    border: 'none',
    color: '#b8d2f2',
    cursor: 'pointer',
    fontSize: '20px',
    textDecoration: 'underline',
    padding: 0,
  };

  const saveButtonStyle = {
    backgroundColor: '#547aad',
    border: 'none',
    color: 'white',
    borderRadius: '10px',
    padding: '12px 20px',
    cursor: 'pointer',
    fontSize: '18px',
  };

  const cancelButtonStyle = {
    backgroundColor: 'transparent',
    border: '1px solid #7fa0cb',
    color: 'white',
    borderRadius: '10px',
    padding: '12px 20px',
    cursor: 'pointer',
    fontSize: '18px',
  };
//Toggles the profile card open and closed
//Fetches profile data
  const handleAccountClick = async () => {
    if (showProfile) {
      setShowProfile(false);
      return;
    }

    if (profile) {
      setShowProfile(true);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      return;
    }

    setIsLoadingProfile(true);

    try {
      const response = await fetch(`https://dp4-team-28-production.up.railway.app/patients-login/profile?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Could not load profile.');
      }

      setProfile(data);
      //Pre-fills the boxes with fetched data
      setEditForm({
        name: data.name,
        username: data.username,
        age: String(data.age),
        address: data.address,
        current_password: '',
      });
      setShowProfile(true);
    } catch (error) {
      alert(error.message || 'Could not connect to the server.');
    } finally {
      setIsLoadingProfile(false);
    }
  };
//Updates one field in the edit form without overwriting the others
  const handleEditChange = (field, value) => {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }));
  };
//Enters editing mode,resetting the form to the current and saved profile inputs
  const handleStartEditing = () => {
    if (!profile) {
      return;
    }

    setEditForm({
      name: profile.name,
      username: profile.username,
      age: String(profile.age),
      address: profile.address,
      current_password: '',
    });
    setIsEditingProfile(true);
  };
//Exits editing mode and discard unsaved changes
  const handleCancelEditing = () => {
    setIsEditingProfile(false);
    if (profile) {
      setEditForm({
        name: profile.name,
        username: profile.username,
        age: String(profile.age),
        address: profile.address,
        current_password: '',
      });
    }
  };
//Sends the edited profile to the back end
//Requires the user to enter password for confirmation before saving 
  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      return;
    }

    if (!editForm.current_password) {
      alert('Please enter your password to confirm changes.');
      return;
    }

    setIsSavingProfile(true);

    try {
      const response = await fetch(`https://dp4-team-28-production.up.railway.app/patients-login/profile-update?token=${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          username: editForm.username,
          age: Number(editForm.age),
          address: editForm.address,
          current_password: editForm.current_password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Could not update profile.');
      }
      
      setProfile(data.profile);
      setEditForm({
        name: data.profile.name,
        username: data.profile.username,
        age: String(data.profile.age),
        address: data.profile.address,
        current_password: '',
      });
      localStorage.setItem('name', data.profile.name);
      setIsEditingProfile(false);
      alert('Profile updated successfully.');
    } catch (error) {
      alert(error.message || 'Could not connect to the server.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/*Sidebar navigation */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#547aad',
            height: '650px',
            width: '200px',
          }}
        >
          <Link
            to="/patient"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '36px',
              padding: '50px 20px',
              borderBottom: '5px solid #325585',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            Home
          </Link>
          <Link
            to="/patient/schedule"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '36px',
              padding: '50px 20px',
              borderBottom: '5px solid #325585',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            Schedule
          </Link>
          <Link
            to="/patient/history"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '36px',
              padding: '50px 20px',
              borderBottom: '5px solid #325585',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            History
          </Link>
          <Link
            to="/patient/map"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '36px',
              padding: '50px 20px',
              borderBottom: '5px solid #325585',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            Map
          </Link>
          {/*Darkens background colour in sidebar when on this page */}
          <Link
            to="/patient/settings"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '36px',
              padding: '50px 20px',
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: location.pathname === '/patient/settings' ? '#325585' : 'transparent',
            }}
          >
            Settings
          </Link>
        </nav>
      </div>
      {/* Main content area */}
      <div style={{ flex: 1, padding: '40px' }}>
        <h1
          style={{
            color: '#547aad',
            fontSize: '100px',
            marginBottom: '20px',
            fontFamily: 'Monospace',
            paddingRight: '150px',
          }}
        >
          Settings
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '90px' }}>
          <hr style={lineStyle} />
          {/* Account button: opens/closes the profile editing page */}
          <button
            type="button"
            style={{ ...buttonStyle, fontSize: '48px', fontFamily: 'DM Sans' }}
            onClick={handleAccountClick}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = '#325585';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = '#5f87bd';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5f87bd';
            }}
          >
            <span style={{ fontSize: '48px' }}>Account</span>
            <div style={{ fontSize: '24px', opacity: 0.9, marginTop: '6px' }}>
              Password, security, personal details
            </div>
          </button>

          {showProfile && (
            <div style={profileCardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ fontSize: '34px', fontFamily: 'DM Sans' }}>
                  {isLoadingProfile ? 'Loading account info...' : 'Profile Information'}
                </div>
                {!isLoadingProfile && profile && !isEditingProfile && (
                  <button type="button" style={editLinkStyle} onClick={handleStartEditing}>
                    Edit
                  </button>
                )}
              </div>
              {!isLoadingProfile && profile && (
                <>
                {/*Editing mode: show input fields */}
                  {isEditingProfile ? (
                    <>
                      <div style={profileRowStyle}>
                        <div style={{ width: '100%' }}>
                          <strong>Name</strong>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => handleEditChange('name', e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                      <div style={profileRowStyle}>
                        <div style={{ width: '100%' }}>
                          <strong>Username</strong>
                          <input
                            type="text"
                            value={editForm.username}
                            onChange={(e) => handleEditChange('username', e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                      <div style={profileRowStyle}>
                        <div style={{ width: '100%' }}>
                          <strong>Age</strong>
                          <input
                            type="number"
                            value={editForm.age}
                            onChange={(e) => handleEditChange('age', e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                      <div style={profileRowStyle}>
                        <div style={{ width: '100%' }}>
                          <strong>Address</strong>
                          <input
                            type="text"
                            value={editForm.address}
                            onChange={(e) => handleEditChange('address', e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                      <div style={profileRowStyle}>
                        <div style={{ width: '100%' }}>
                          <strong>Assigned PSW Username</strong>
                          <div style={{ marginTop: '8px', opacity: 0.9 }}>{profile.assigned_psw_username}</div>
                        </div>
                      </div>
                      <div style={profileRowStyle}>
                        <div style={{ width: '100%' }}>
                          <strong>Assigned PSW Name</strong>
                          <div style={{ marginTop: '8px', opacity: 0.9 }}>{profile.assigned_psw_name}</div>
                        </div>
                      </div>
                      {/* Password confirmation required before saving */}
                      <div style={{ ...profileRowStyle, borderBottom: 'none' }}>
                        <div style={{ width: '100%' }}>
                          <strong>Confirm With Password</strong>
                          <input
                            type="password"
                            value={editForm.current_password}
                            onChange={(e) => handleEditChange('current_password', e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '18px' }}>
                        <button type="button" style={cancelButtonStyle} onClick={handleCancelEditing}>
                          Cancel
                        </button>
                        <button
                          type="button"
                          style={{ ...saveButtonStyle, opacity: isSavingProfile ? 0.8 : 1 }}
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile}
                        >
                          {isSavingProfile ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                    {/* Show read-only profile data */}
                      <div style={profileRowStyle}>
                        <strong>Name and Username</strong>
                        <span>{profile.name} ({profile.username})</span>
                      </div>
                      <div style={profileRowStyle}>
                        <strong>Age</strong>
                        <span>{profile.age}</span>
                      </div>
                      <div style={profileRowStyle}>
                        <strong>Assigned PSW Username</strong>
                        <span>{profile.assigned_psw_username}</span>
                      </div>
                      <div style={profileRowStyle}>
                        <strong>Assigned PSW Name</strong>
                        <span>{profile.assigned_psw_name}</span>
                      </div>
                      <div style={{ ...profileRowStyle, borderBottom: 'none' }}>
                        <strong>Address</strong>
                        <span>{profile.address}</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          <hr style={lineStyle} />
          {/* Placeholder notification button */}
          <button
            type="button"
            style={{ ...buttonStyle, fontSize: '48px', fontFamily: 'DM Sans' }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = '#325585';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = '#5f87bd';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5f87bd';
            }}
          >
            Notifications
          </button>

          <hr style={lineStyle} />
          {/* Log out button: redirects to login page */}
          <button
            type="button"
            style={{ ...buttonStyle, fontSize: '48px', fontFamily: 'DM Sans' }}
            onClick={() => navigate('/login')}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = '#325585';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = '#5f87bd';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5f87bd';
            }}
          >
            Log out
          </button>
          <hr style={lineStyle} />
        </div>
      </div>
    </div>
  );
}