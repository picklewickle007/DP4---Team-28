import { useEffect, useState } from "react"; //imports store data tool from react
import { Link, useLocation } from 'react-router-dom';
export default function PatientHistory() { //makes available to other files
  const [history, setHistory] = useState([]); //creates a state variable called history and a function to update it called setHistory, initialized as an empty array
  const location = useLocation();

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
        //this is what displays the timestamp on the right of the screen
          style={{
            backgroundColour: "#547aad",
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
          color: "#547aad"
        }}
        >
          {item.message} {/*//displays message from data base*/}
        </div>
      </div>
    );
  }

  return ( //helps the boxes actually display on screen and displays additional text
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
            boxSizing: 'border-box',
            backgroundColor: location.pathname === '/patient/history' ? '#325585' : 'transparent'
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
            boxSizing: 'border-box'
          }}>Settings</Link>
 
        </nav>
      </div>
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontFamily: "Monospace",
        textAlign: "center",
        marginBottom: '20px',
        fontSize: '100px',
        marginLeft: '175px',
        color: "#547aad" }}>
        History
      </h1>
      <div>
        {historyItems}
      </div>
    </div>
    </div>
  );
}