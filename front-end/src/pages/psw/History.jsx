//sets up psw history page's front-end
//import statments imports data storing tools from react
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
 
//exports patient history component so other files can use it
export default function PSWHistory() {
 
  //constants to set history variable and sture the url path
  const location = useLocation();
  const [history, setHistory] = useState([]); //creates a state variable called history and a function to update it called setHistory, initialized as an empty array
 
  //runs when page loads
  useEffect(function () {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    fetch("https://dp4-team-28-production.up.railway.app/history/psw?token=" + token) //sends a GET request to the backend with token
      .then(function (res) {
        return res.json();
      }) //converts data to javascript
      .then(function (data) {
        setHistory(data); //saves data to history
      });
  }, []);
 
  const historyItems = []; //boxes you will see on screen
  for (let i = 0; i < history.length; i = i + 1) {
    const item = history[i]; //returns from backend one line at a time
    historyItems.push(
      <div
        key={item.id} //tells each box apart from each other
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
        //this is what displays the date on the right of the screen
          style={{
            backgroundColor: "#7ed957",
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
            color: "#7ed957",
          }}
        >
          {item.task} - {item.status}{" "}
          {/*displays task and status from database*/}
        </div>
      </div>
    );
  }
 
  let historyContent = <p>No history found.</p>;
    if (historyItems.length > 0) {
      historyContent = historyItems;
    }
  //helps the boxes actually display on screen and displays additional text
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {/* Side Bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh", minHeight: "100vh"  /* make this element at least as tall as the full window */
        }}
      >
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#7ed957",
            height: "650px",
            width: "200px",
          }}
        >
          <Link
            to="/psw"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "36px",
              padding: "50px 20px",
              borderBottom: "5px solid #64a449",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            Home
          </Link>
          <Link
            to="/psw/schedule"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "36px",
              padding: "50px 20px",
              borderBottom: "5px solid #64a449",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            Schedule
          </Link>
          <Link
            to="/psw/history"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "36px",
              padding: "50px 20px",
              borderBottom: "5px solid #64a449",
              width: "100%",
              boxSizing: "border-box",
              backgroundColor:
                location.pathname === "/psw/history" ? "#64a449" : "transparent",
            }}
          >
            History
          </Link>
          <Link
            to="/psw/map"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "36px",
              padding: "50px 20px",
              borderBottom: "5px solid #64a449",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            Map
          </Link>
          <Link
            to="/psw/settings"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "36px",
              padding: "50px 20px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            Settings
          </Link>
        </nav>
      </div>
 
      {/* main page */}
      <div style={{
        flex: 1,
        padding: '40px',
        }}>
        <h1
        style={{
          color: "#7ed957",
          fontFamily: "Monospace"
          }}
          >
            PSW History
            </h1>
        {/* returns no history found if no items in the list */}
        {historyContent}
      </div>
      </div>
  );
}