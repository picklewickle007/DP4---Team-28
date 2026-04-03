import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function PSWSettings() {
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
    current_password: '',
  });

  const lineStyle = {
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: '#7ed957',
    width: '70%',
    marginLeft: '80px',
    marginTop: '0',
    marginBottom: '0',
  };

  const buttonStyle = {
    backgroundColor: '#8be067',
    border: '1px solid #a7eb8c',
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
    backgroundColor: '#2e4227',
    border: '1px solid #7ed957',
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
    border: '1px solid #a7eb8c',
    backgroundColor: '#20301b',
    color: 'white',
    fontSize: '18px',
    boxSizing: 'border-box',
    marginTop: '8px',
  };

  const editLinkStyle = {
    background: 'none',
    border: 'none',
    color: '#d5f5c9',
    cursor: 'pointer',
    fontSize: '20px',
    textDecoration: 'underline',
    padding: 0,
  };

  const saveButtonStyle = {
    backgroundColor: '#64a449',
    border: 'none',
    color: 'white',
    borderRadius: '10px',
    padding: '12px 20px',
    cursor: 'pointer',
    fontSize: '18px',
  };

  const cancelButtonStyle = {
    backgroundColor: 'transparent',
    border: '1px solid #a7eb8c',
    color: 'white',
    borderRadius: '10px',
    padding: '12px 20px',
    cursor: 'pointer',
    fontSize: '18px',
  };

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
      const response = await fetch(`http://localhost:8000/psw-login/profile?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Could not load profile.');
      }

      setProfile(data);
      setEditForm({
        name: data.name,
        username: data.username,
        age: String(data.age),
        current_password: '',
      });
      setShowProfile(true);
    } catch (error) {
      alert(error.message || 'Could not connect to the server.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleEditChange = (field, value) => {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleStartEditing = () => {
    if (!profile) {
      return;
    }

    setEditForm({
      name: profile.name,
      username: profile.username,
      age: String(profile.age),
      current_password: '',
    });
    setIsEditingProfile(true);
  };

  const handleCancelEditing = () => {
    setIsEditingProfile(false);
    if (profile) {
      setEditForm({
        name: profile.name,
        username: profile.username,
        age: String(profile.age),
        current_password: '',
      });
    }
  };

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
      const response = await fetch(`http://localhost:8000/psw-login/profile-update?token=${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          username: editForm.username,
          age: Number(editForm.age),
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
            backgroundColor: '#7ed957',
            height: '650px',
            width: '200px',
          }}
        >
          <Link
            to="/psw"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '36px',
              padding: '50px 20px',
              borderBottom: '5px solid #64a449',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            Home
          </Link>
          <Link
            to="/psw/schedule"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '36px',
              padding: '50px 20px',
              borderBottom: '5px solid #64a449',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            Schedule
          </Link>
          <Link
            to="/psw/history"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '36px',
              padding: '50px 20px',
              borderBottom: '5px solid #64a449',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            History
          </Link>
          <Link
            to="/psw/map"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '36px',
              padding: '50px 20px',
              borderBottom: '5px solid #64a449',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            Map
          </Link>
          <Link
            to="/psw/settings"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '36px',
              padding: '50px 20px',
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: location.pathname === '/psw/settings' ? '#64a449' : 'transparent',
            }}
          >
            Settings
          </Link>
        </nav>
      </div>

      <div style={{ flex: 1, padding: '40px' }}>
        <h1
          style={{
            color: '#7ed957',
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
          <button
            type="button"
            style={{ ...buttonStyle, fontSize: '48px', fontFamily: 'DM Sans' }}
            onClick={handleAccountClick}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = '#64a449';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = '#8be067';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8be067';
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
                      <div style={profileRowStyle}>
                        <strong>Name and Username</strong>
                        <span>{profile.name} ({profile.username})</span>
                      </div>
                      <div style={{ ...profileRowStyle, borderBottom: 'none' }}>
                        <strong>Age</strong>
                        <span>{profile.age}</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          <hr style={lineStyle} />
          <button
            type="button"
            style={{ ...buttonStyle, fontSize: '48px', fontFamily: 'DM Sans' }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = '#64a449';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = '#8be067';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8be067';
            }}
          >
            Notifications
          </button>
          <hr style={lineStyle} />
          <button
            type="button"
            style={{ ...buttonStyle, fontSize: '48px', fontFamily: 'DM Sans' }}
            onClick={() => navigate('/login')}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = '#64a449';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = '#8be067';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8be067';
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
