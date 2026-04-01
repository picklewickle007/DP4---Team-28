import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [fullname, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [assignedPSW, setAssignedPSW] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSignup = () => {
        if (!username || !password || !role) {
            alert('Please make sure all fields are filled out.');
            return;
        }
        if (role === 'patient') {
            navigate('/patient');
        }
        else {
            navigate('/psw');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    };
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            gap: '16px',
        }}>
            <h1 style={{
                fontFamily: 'Monospace',
                fontSize: '80px',
                marginTop: '-200px'
            }}>Welcome to PSUU</h1>

            <h1 style={{
                fontFamily: 'DM Sans',
                paddingTop: '80px'
            }}>Sign-Up</h1>

            <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{
                    padding: '10px',
                    width: '250px',
                    fontSize: '24px',
                    fontFamily: 'DM Sans'
                }}>
                <option value='' disabled>Select role</option>
                <option value='patient'>Patient</option>
                <option value='psw'>PSW</option>
            </select>

            {/*Patient signup*/}
            {role === 'patient' && (
                <>
                    <input
                        type='text'
                        placeholder="Full Name (First, Last)"
                        value={fullname}
                        onChange={e => setFullName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ padding: '10px', width: '250px', fontSize: '23px', fontFamily: 'DM Sans' }} />

                    <input
                        type='text'
                        placeholder="Age"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }} />

                    <input
                        type='text'
                        placeholder="Address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }} />

                    <input
                        type='text'
                        placeholder="Assigned PSW username"
                        value={assignedPSW}
                        onChange={e => setAssignedPSW(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ padding: '10px', width: '250px', fontSize: '21px', fontFamily: 'DM Sans' }} />

                    <input
                        type='text'
                        placeholder="Pick a username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }} />

                    <input
                        type='text'
                        placeholder="Create a Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }} />

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

                    <p style={{ fontFamily: 'DM Sans', fontSize: '16px' }}>
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >Login</span>
                    </p>
                </>
            )}
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
                        type='text'
                        placeholder="Age"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }} />

                    <input
                        type='text'
                        placeholder="Create a username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }} />

                    <input
                        type='text'
                        placeholder="Create a Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }} />

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

                    <p style={{ fontFamily: 'DM Sans', fontSize: '16px' }}>
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >Login</span>
                    </p>
                </>
            )}
        </div>

    );
}