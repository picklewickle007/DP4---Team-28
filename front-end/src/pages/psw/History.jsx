import { useEffect, useState } from "react"; //imports store data tool from react
import { Link, useLocation } from 'react-router-dom';
 
export default function PSWHistory() {
  const location = useLocation();
  const [history, setHistory] = useState([]);

  useEffect(function () { //runs when the page loads
    fetch("http://localhost:8000/history") //sends a GET request to the backend
      .then(function (res) {
        return res.json();
      }) //converts data to javscript
      .then(function (data) {
        setHistory(data); //saves data to history
      });
  }, []); 
  const historyItems = []; //boxes you will see on screen 
  for (let i = 0; i < history.length; i=i+1) {
    const item = history[i]; //returns from backend one line at a time
    historyItems.push(
      <div 
        key = {item.id} //tells each box apart from each other
        //styles the boxes
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "lightgray",
          color: "white",
          borderRadius: "16px",
          padding: "12px 16px",
          marginBottom: "12px",
        }}
        >
          <div
            style={{
              backgroundColour: "#7ed957",
              color: "white",
              fontFamily: "Monospace",
              borderRadius: "12px",
              padding: "8px 12px",
              marginRight: "24px",
              minWidth: "80px"
            }}
          >
            {item.timestamp}
          </div>
          <div
            style={{
              fontSize: "24px",
              fontFamily: "Monospace",
              color: "#7ed957"
            }}
          >
            {item.message}
          </div>
        </div>
      );
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
      <div style={{padding: '40px' }}>
        <h1 style={{
          color: '#7ed957',
          fontSize: '100px',
          marginBottom: '20px',
          fontFamily: 'Monospace',
          textAlign: 'center',
            marginLeft: '100px'
        }}> PSW History</h1>
      </div>
    </div>
  );
}