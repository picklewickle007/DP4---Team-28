import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function PSWHome() {
  const [activeButton, setActiveButton] = useState(null);
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
            boxSizing: 'border-box',
            backgroundColor: location.pathname === '/psw' ? '#64a449' : 'transparent'
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
            boxSizing: 'border-box'
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
          paddingRight: '220px'
        }}>Home</h1>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          paddingLeft: '50px',
          alignItems: 'center',
          paddingTop: '80px',
          gap: '100px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '60px'
          }}>
            <button onClick={() => setActiveButton(activeButton === 'schedule' ? null : 'schedule')}
              style={{
                width: '400px',
                height: '200px',
                backgroundColor: activeButton === 'schedule' ? '#64a449' : '#7ed957',
                fontFamily: 'DM Sans',
                color: 'white',
                cursor: 'pointer',
                border: 'none',
                fontSize: '40px',
                borderRadius: '30px'
              }}>
              Check in
            </button>
            <button onClick={() => setActiveButton(activeButton === 'queue' ? null : 'queue')}
              style={{
                width: '400px',
                height: '200px',
                backgroundColor: activeButton === 'queue' ? '#64a449' : '#7ed957',
                fontFamily: 'DM Sans',
                color: 'white',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '30px',
              }}>
              <span style={{ fontSize: '40px' }}> Pending </span>
              <br />
              <span style={{ fontSize: '40px' }}> Requests</span>
            </button>
          </div>
          <button onClick={() => setActiveButton(activeButton === 'emergency' ? null : 'emergency')}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              backgroundColor: activeButton === 'emergency' ? '#8f1d1d' : '#b82525',
              fontFamily: 'DM Sans',
              color: 'white',
              cursor: 'pointer',
              border: 'none',
              fontSize: '24px',
            }}>
            ALERTS
          </button>
        </div>
      </div>
    </div>
  );
}