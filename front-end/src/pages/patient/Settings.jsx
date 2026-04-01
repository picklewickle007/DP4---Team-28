import { Link, useLocation } from 'react-router-dom';

export default function PatientSettings() {
  const location = useLocation();
  const lineStyle = {
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: '#547aad',
    width: '70%',
    marginLeft: '80px',
    marginTop: '0'
  }

  const buttonStyle = {
    background: 'none',
    border: 'none',
    textAlign: 'left',
    width: '70%',
    cursor: 'pointer',
    marginLeft: '0'
  }
  return (
    <div style={{ display: 'flex' }}>

      {/* Side Bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#547aad',
          height: '650px',
          width: '200px'
        }}>

          <Link to="/patient" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box'
          }}>Home</Link>
          <Link to="/patient/schedule" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box'
          }}>Schedule</Link>
          <Link to="/patient/history" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box'
          }}>History</Link>
          <Link to="/patient/map" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box'
          }}>Map</Link>
          <Link to="/patient/settings" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: location.pathname === '/patient/settings' ? '#325585' : 'transparent'
          }}>Settings</Link>
        </nav>
      </div>

      {/*Main Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        <h1 style={{
          color: '#547aad',
          fontSize: '100px',
          marginBottom: '20px',
          fontFamily: 'Monospace',
          paddingRight: '150px'
        }}>Settings</h1>
        <hr style={{ ...lineStyle, marginTop: '120px' }} />
        <button style={{ ...buttonStyle, fontSize: '48px', fontFamily: 'DM Sans'}}>
          <span style={{ fontSize: '48px' }}>Account</span>
          <div style={{ fontSize: '24px' }}>Password, security, personal details, security</div>
        </button>
        <hr style={{ ...lineStyle, marginTop: '20px' }} />
        <button style={{ ...buttonStyle, fontSize: '48px', fontFamily: 'DM Sans' }}>Notifications</button>
        <hr style={{ ...lineStyle, marginTop: '40px' }} />
        <button style={{ ...buttonStyle, fontSize: '48px', fontFamily: 'DM Sans' }}>Log out</button>
        <hr style={{ ...lineStyle, marginTop: '40px' }} />
      </div>
    </div>
  );
}