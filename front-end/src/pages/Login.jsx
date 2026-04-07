// Sets up Login page front end
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  // Controlled input state for the username and password fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Loading state when the login request is in progress
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Sends login credentials to back end and redirects based on user's role
  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please make sure all fields are filled out.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://dp4-team-28-production.up.railway.app/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { method: 'POST' },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed.');
      }
// Store the token, name, role in localStorage for use across the app
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      localStorage.setItem('role', data.role);
//Redirect to the appropriate home page based on the user's role
      if (data.role === 'patient') {
        navigate('/patient');
      } else {
        navigate('/psw');
      }
    } catch (error) {
      alert(error.message || 'Could not connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };
// Allows the user to submit the login form by pressing Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: '100vh',
        gap: '16px',
      }}
    >
      {/* Logo at the top of the page */}
            <img
        src="/UU.png"
        alt="PSUU Logo"
        style={{ width: '150px'}}
      />
      <h1
        style={{
          fontFamily: 'Monospace',
          fontSize: '80px'
        }}
      >
        {/* App title */}
        Welcome to PSUU
      </h1>

      <h1
        style={{
          fontFamily: 'DM Sans',
          paddingTop: '20px',
        }}
      >
        Login
      </h1>
{/* Username input: triggers login on Enter key */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
      />
{/* Password input: trigger login on Enter key */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
      />
{/* Login button: disabled and shows loading text while request is in progress */}
      <button
        onClick={handleLogin}
        disabled={isSubmitting}
        style={{
          padding: '10px',
          fontSize: '24px',
          backgroundColor: '#547aad',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isSubmitting ? 'wait' : 'pointer',
          opacity: isSubmitting ? 0.8 : 1,
          fontFamily: 'DM Sans',
        }}
      >
        {isSubmitting ? 'Logging In...' : 'Login'}
      </button>
{/* Link to the sign up page for new users */}
      <p style={{ fontFamily: 'DM Sans', fontSize: '16px' }}>
        Need an account?{' '}
        <a
          href="/signup"
          style={{
            textDecoration: 'underline',
            color: 'inherit',
            fontFamily: 'DM Sans',
            fontSize: '16px',
          }}
        >
          Sign up
        </a>
      </p>
    </div>
  );
}
