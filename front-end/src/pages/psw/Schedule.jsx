import { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';

export default function PSWSchedule() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const location = useLocation();

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const tempDate = new Date();
    tempDate.setDate(tempDate.getDate() + i);
    weekDays.push(tempDate);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function formatHour(hour) {
    if (hour === 0) return "12am";
    else if (hour < 12) return hour + "am";
    else if (hour === 12) return "12pm";
    else return (hour - 12) + "pm";
  }

  useEffect(function () {
    fetch("http://localhost:8000/schedule")
      .then(function (res) { return res.json(); })
      .then(function (data) { setTasks(data); });
  }, []);

  const dayButtons = [];
  for (let i = 0; i < 7; i++) {
    const date = weekDays[i];

    function getBgColour() {
      if (selectedDate.toDateString() === date.toDateString()) return "#7ed957";
      else return "lightgray";
    }

    function getTextColor() {
      if (selectedDate.toDateString() === date.toDateString()) return "white";
      else return "black";
    }

    dayButtons.push(
      <div key={date.toDateString()} style={{ flex: 1 }}>
        <button
          onClick={function () { setSelectedDate(date); }}
          style={{
            backgroundColor: getBgColour(),
            color: getTextColor(),
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "12px 0",
            justifyContent: "center",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            fontFamily: "Monospace"
          }}
        >
          <div style={{ fontSize: "20px" }}>{dayNames[date.getDay()]}</div>
          <div style={{ fontSize: "18px", fontWeight: "bold", fontFamily: "Monospace" }}>
            {date.getDate()}
          </div>
        </button>
      </div>
    );
  }

  const filteredTasks = [];
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].date === selectedDate.toLocaleDateString("en-CA")) {
      filteredTasks.push(tasks[i]);
    }
  }

  const timeRows = [];
  for (let i = 0; i < 24; i++) {
    const tasksForThisHour = [];
    for (let j = 0; j < filteredTasks.length; j++) {
      const t = filteredTasks[j];
      let hourPart = t.startTime ? parseInt(t.startTime.split(":")[0]) : -1;
      if (hourPart === i) tasksForThisHour.push(t);
    }

    timeRows.push(
      <div key={i} style={{ height: "60px", borderTop: "1px solid lightgray", display: "flex", position: "relative" }}>
        <div style={{ width: "50px", fontSize: "12px", color: "black", fontFamily: "Monospace" }}>
          {formatHour(i)}
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          {tasksForThisHour.map(function (task) {
            const minutesPast = parseInt(task.startTime.split(":")[1]) || 0;
            const duration = parseInt(task.time) || 30;
            return (
              <div key={task.id} style={{
                position: "absolute",
                top: minutesPast + "px",
                left: "5px",
                right: "10px",
                height: duration + "px",
                backgroundColor: "#7ed957",
                color: "white",
                borderRadius: "8px",
                padding: "4px",
                fontSize: "12px",
                zIndex: 10,
                fontFamily: "Monospace"
              }}>
                {task.task}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>

      {/* Side Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#7ed957', height: '650px', width: '200px' }}>
          <Link to="/psw" style={{ color: 'white', textDecoration: 'none', fontSize: '36px', padding: '50px 20px', borderBottom: '5px solid #64a449', width: '100%', boxSizing: 'border-box' }}>Home</Link>
          <Link to="/psw/schedule" style={{ color: 'white', textDecoration: 'none', fontSize: '36px', padding: '50px 20px', borderBottom: '5px solid #64a449', width: '100%', boxSizing: 'border-box', backgroundColor: location.pathname === '/psw/schedule' ? '#64a449' : 'transparent' }}>Schedule</Link>
          <Link to="/psw/history" style={{ color: 'white', textDecoration: 'none', fontSize: '36px', padding: '50px 20px', borderBottom: '5px solid #64a449', width: '100%', boxSizing: 'border-box' }}>History</Link>
          <Link to="/psw/map" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '36px', 
            padding: '50px 20px', 
            borderBottom: '5px solid #64a449', 
            width: '100%', 
            boxSizing: 'border-box' 
            }}
            >
              Map
              </Link>
          <Link to="/psw/settings" 
          style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '36px', 
            padding: '50px 20px', 
            width: '100%', 
            boxSizing: 'border-box' 
            }}
            >
              Settings
              </Link>
        </nav>
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        <h1 style={{ fontFamily: "Monospace", 
          color: "#7ed957" 
          }}
          >
            PSW Schedule</h1>

        <div style={{ display: "flex", 
          flexDirection: "row", 
          gap: "8px", 
          width: "100%", 
          marginTop: "20px" 
          }}
          >
          {dayButtons}
        </div>

        <div style={{ overflowY: "scroll", 
          height: "500px", 
          width: "100%" 
          }}
          >
          {timeRows}
        </div>
      </div>

    </div>
  );
}