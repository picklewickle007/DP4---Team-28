//sets up patient history page's front-end 
//import statements imports data storing tools from react
import { useEffect, useState } from "react"; 
import { Link, useLocation } from 'react-router-dom';

//exports patient history component so other files can use it
export default function PatientHistory() {
  
  //constants to set history variable and structure the url path
  const [history, setHistory] = useState([]);
  const location = useLocation();

  //block that runs when the page loads
  useEffect(function () { 
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    fetch("https://dp4-team-28-production.up.railway.app/history/patient?token=" + token)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setHistory(data);
      });
  }, []);

  const historyItems = [];
  for (let i = 0; i < history.length; i=i+1) {
    const item = history[i];
    historyItems.push(
      <div
        key={item.id}
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
        {/* this is what displays the date on the right of the screen */}
        <div
          style={{
            backgroundColor: "#547aad",
            color: "white",
            fontFamily: "Monospace",
            borderRadius: "12px",
            padding: "8px 12px",
            marginRight: "24px",
            minWidth: "80px",
          }}
        >
          {item.date}
        </div>
        <div
          style={{
            fontSize: "24px",
            fontFamily: "Monospace",
            color: "#547aad",
          }}
        >
          {/* displays task and status from database */}
          {item.task} - {item.status} 
        </div>
      </div>
    );
  }

  let historyContent = <p>No history found.</p>;
    if (historyItems.length > 0) {
      historyContent = historyItems;
    }

  return ( 
    <div style={{ display: 'flex' }}>

      {/* Side Bar */}
      {/* make this element at least as tall as the full window */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
      >
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#547aad',
          height: '650px',
          width: '200px'
        }}
        >
          <Link to="/patient" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            Home
          </Link>
          <Link to="/patient/schedule" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            Schedule
          </Link>
          <Link to="/patient/history" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: location.pathname === '/patient/history' ? '#325585' : 'transparent'
          }}>
            History
          </Link>
          <Link to="/patient/map" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            Map
          </Link>
          <Link to="/patient/settings" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            Settings
          </Link>
        </nav>
      </div>
      
      {/* main page */}
      <div style={{ 
        flex: 1, 
        padding: '40px', 
        }}
        >
        <h1 
        style={{ 
          color: "#547aad", 
          fontFamily: "Monospace" 
          }}
          >
            Patient History
            </h1>
        {/* returns no history found if no items in the list */}
        {historyContent}
      </div>
      </div>
  );
}