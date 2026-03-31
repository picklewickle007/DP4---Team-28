import { Link, useLocation } from 'react-router-dom';
 
export default function PSWHistory() {
  const location = useLocation();
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
          backgroundColor: '#7ed957',
          height: '650px',
          width: '200px'
        }}>
 
          <Link to="/psw" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #64a449',
            width: '100%',
            boxSizing: 'border-box'
          }}>Home</Link>
          <Link to="/psw/schedule" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #64a449',
            width: '100%',
            boxSizing: 'border-box'
          }}>Schedule</Link>
          <Link to="/psw/history" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #64a449',
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: location.pathname === '/psw/history' ? '#64a449' : 'transparent'
          }}>History</Link>
          <Link to="/psw/map" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #64a449',
            width: '100%',
            boxSizing: 'border-box'
          }}>Map</Link>
          <Link to="/psw/settings" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            width: '100%',
            boxSizing: 'border-box'
          }}>Settings</Link>
 
        </nav>
      </div>
 
      {/*Main Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        <h1 style={{
          color: '#7ed957',
          fontSize: '100px',
          marginBottom: '20px',
          fontFamily: 'Monospace',
          paddingRight: '150px'
        }}>History</h1>
      </div>
    </div>
  );
}