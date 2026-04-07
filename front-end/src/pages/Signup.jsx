// Sets up the Sign up page front end
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  // Controlled input state for all signup fields
  const [fullname, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [assignedPSW, setAssignedPSW] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  // Loading state while the signup request is in progress
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validates inputs, creates an account, logs in the user and redirects to appropriate home page
  const handleSignup = async () => {
    if (!fullname || !age || !username || !password || !role) {
      alert('Please make sure all fields are filled out.');
      return;
    }

    if (role === 'patient' && (!address || !assignedPSW)) {
      alert('Please make sure all patient fields are filled out.');
      return;
    }

    if (Number.isNaN(Number(age)) || Number(age) <= 0) {
      alert('Please enter a valid age.');
      return;
    }

    setIsSubmitting(true);

    try {
      let signupResponse;

      // Use different endpoints and request bodies depending on the role
      if (role === 'patient') {
        signupResponse = await fetch(
          `https://dp4-team-28-production.up.railway.app/patients-login/signup?psw_username=${encodeURIComponent(assignedPSW)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: fullname,
              age: Number(age),
              address,
              username,
              password,
            }),
          },
        );
      } else {
        signupResponse = await fetch('https://dp4-team-28-production.up.railway.app/psw-login/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: fullname,
            age: Number(age),
            username,
            password,
          }),
        });
      }

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(signupData.detail || 'Sign up failed.');
      }
      // Logs the user in
      const loginEndpoint =
        role === 'patient'
          ? 'https://dp4-team-28-production.up.railway.app/patients-login/login'
          : 'https://dp4-team-28-production.up.railway.app/psw-login/login';

      const loginResponse = await fetch(
        `${loginEndpoint}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { method: 'POST' },
      );

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.detail || 'Account created, but login failed.');
      }
      // Stores the token, name, role in localStorage for use across the app
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('name', loginData.name);
      localStorage.setItem('role', role);
      // Redirects to the appropriate home page based on the user's role
      if (role === 'patient') {
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
  // Allows the user to submit the signup form by pressing Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
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
      {/* App title */}
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
        Welcome to PSUU
      </h1>

      <h1
        style={{
          fontFamily: 'DM Sans',
          paddingTop: '50px'
        }}
      >
        Sign-Up
      </h1>
      {/* Role selector: controls which set of input fields is shown below */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{
          padding: '0',
          width: '250px',
          fontSize: '24px',
          fontFamily: 'DM Sans',
        }}
      >
        <option value="" disabled>
          Select role
        </option>
        <option value="patient">Patient</option>
        <option value="psw">PSW</option>
      </select>
      {/* Link to log in page */}
      <p style={{ fontFamily: 'DM Sans', fontSize: '16px' }}>
        Already have an account?{' '}
        <a
          href="/login"
          style={{
            textDecoration: 'underline',
            color: 'inherit',
            fontFamily: 'DM Sans',
            fontSize: '16px',
          }}
        >
          Login
        </a>
      </p>
      {/* Patient signup form: only when 'patient' is selected */}
      {role === 'patient' && (
        <>
          <input
            type="text"
            placeholder="Full Name (First, Last)"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '23px', fontFamily: 'DM Sans' }}
          />

          <input
            type="text"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <input
            type="text"
            placeholder="Assigned PSW username"
            value={assignedPSW}
            onChange={(e) => setAssignedPSW(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '21px', fontFamily: 'DM Sans' }}
          />

          <input
            type="text"
            placeholder="Pick a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <input
            type="password"
            placeholder="Create a Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <button
            onClick={handleSignup}
            style={{
              padding: '10px',
              fontSize: '24px',
              backgroundColor: '#547aad',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'DM Sans'
            }}> Sign-Up </button>
        </>
      )}
      {/* PSW signup form: only when role is 'psw' */}
      {role === 'psw' && (
        <>
          <input
            type='text'
            placeholder="Full Name (First, Last)"
            value={fullname}
            onChange={e => setFullName(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '23px', fontFamily: 'DM Sans' }} />

          <input
            type="text"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <input
            type="text"
            placeholder="Create a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <input
            type="password"
            placeholder="Create a Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <button
            onClick={handleSignup}
            style={{
              padding: '10px',
              fontSize: '24px',
              backgroundColor: '#7ed957',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'DM Sans'
            }}> Sign-Up </button>
        </>
      )}
    </div>

  );
}