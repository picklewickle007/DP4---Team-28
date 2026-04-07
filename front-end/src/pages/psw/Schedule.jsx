//inititalizes front end for psw schedule front-end
//importing tools from react
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function PSWSchedule() {
  //constant for back-end tasks, day being viewed, which task is open 
  const [tasks, setTasks] = useState([]);
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);

  //initailizes days of the week
  const weekDays = [];
  for (let i = 0; i < 7; i = i + 1) {
    const tempDate = new Date();
    tempDate.setDate(tempDate.getDate() + i);
    weekDays.push(tempDate);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  //converts 24hr times to 12 hour times
  function formatHour(hour) {
    if (hour === 0) {
      return "12am";
    }
    if (hour < 12) {
      return hour + "am";
    }
    if (hour === 12) {
      return "12pm";
    }
    return hour - 12 + "pm";
  }

  //gets tasks from the psw backend
  useEffect(function () {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    fetch("https://dp4-team-28-production.up.railway.app/schedule/psw?token=" + token)
      .then(function (res) {
        return res.json();
      })

      .then(async function (data) {
        const normalized = [];
      
        //filters tasks thar match the selected date
        for (let i = 0; i < data.length; i = i + 1) {
          const task = data[i];
          const patientRes = await fetch(
            "https://dp4-team-28-production.up.railway.app/patients-login/" + task.patient_id
          );
          const patient = await patientRes.json();

          normalized.push({
            ...task,
            startTime: task.start_time,
            time: task.duration,
            patient_name: patient.name,
          });
        }
        setTasks(normalized);
      });
  }, []);

  //initalizes day buttons
  const dayButtons = [];
  for (let i = 0; i < 7; i = i + 1) {
    const date = weekDays[i];

    //initalizes background colour of selected day
    function getBgColour() {
      if (selectedDate.toDateString() === date.toDateString()) {
        return "#7ed957";
      } else {
        return "lightgray";
      }
    }

    //initalizes tesxt colour of selected day
    function getTextColor() {
      if (selectedDate.toDateString() === date.toDateString()) {
        return "white";
      } else {
        return "black";
      }
    }

    dayButtons.push(
      <div
        key={date.toDateString()}
        style={{
          flex: 1,
        }}
      >
        <button
          onClick={function () {
            setSelectedDate(date);
          }}
          style={{
            backgroundColor: getBgColour(),
            color: getTextColor(),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "12px 0",
            justifyContent: "center",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            flex: 1,
            width: "100%",
            fontFamily: "Monospace",
          }}
        >
          <div
            style={{
              fontSize: "20px",
            }}
          >
            {dayNames[date.getDay()]}
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              fontFamily: "Monospace",
            }}
          >
            {date.getDate()}
          </div>
        </button>
      </div>
    );
  }

  // filters to selected date
  // "en-CA" formats the date as YYYY-MM-DD to match how the backend 
  const filteredTasks = [];
  for (let i = 0; i < tasks.length; i = i + 1) {
    const task = tasks[i];
    if (task.date === selectedDate.toLocaleDateString("en-CA")) {
      filteredTasks.push(task);
    }
  }

  //puts task on the grid
  const renderedTasks = [];
  for (let i = 0; i < filteredTasks.length; i = i + 1) {
    const task = filteredTasks[i];
    const startTimeParts = (task.startTime || "0:0").split(":");
    const startMinutes =
      parseInt(startTimeParts[0], 10) * 60 + parseInt(startTimeParts[1], 10);
    const duration = parseInt(task.time, 10) || 30;

  // converts start time like "9:30" into total minutes from midnight
    renderedTasks.push(
    <div key={task.id}>
      <div
       onClick={function () {
          if (selectedTask && selectedTask.id === task.id) {
            setSelectedTask(null); // clicking same task closes dropdown
          } else {
            setSelectedTask(task); // clicking task opens dropdown
          }
        }}
        style={{
          position: "absolute",
          top: startMinutes + "px",
          left: "55px",
          right: "10px",
          height: duration + "px",
          backgroundColor: "#7ed957",
          color: "white",
          borderRadius: "8px",
         padding: "4px",
         fontSize: "12px",
         zIndex: 10,
          fontFamily: "Monospace",
          border: "2px solid lightgray",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
         cursor: "pointer",
       }}
      >
      <div style={{ fontWeight: "bold" }}>
        {task.task} - {task.patient_name} - {task.startTime} - {task.time} mins
      </div>
    </div>

    {/* Dropdown appears below task block when clicked */}
    {selectedTask && selectedTask.id === task.id && (
      <div
        style={{
          position: "absolute",
          top: startMinutes + duration + "px",
          left: "55px",
          right: "10px",
          backgroundColor: "white",
          border: "1px solid lightgray",
          borderRadius: "8px",
          zIndex: 20,
          padding: "8px",
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          onClick={function () {
            // calls the complete endpoint which moves task to history and removes from schedule
            const token = localStorage.getItem("token");
            fetch("https://dp4-team-28-production.up.railway.app/schedule/" + selectedTask.id + "/complete?token=" + token, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            })
              .then(function (res) {
                return res.json();
              })
              .then(function () {
                // removes task from the calendar view
                setTasks(tasks.filter(function (t) {
                  return t.id !== selectedTask.id;
                }));
                setSelectedTask(null); // closes the dropdown
              })
              .catch(function () {
                alert("Server error: Could not complete task.");
              });
          }}
          style={{
            flex: 1,
            height: "35px",
            backgroundColor: "#7ed957",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Monospace",
            fontSize: "12px",
          }}
        >
          Mark as Complete
        </button>
      </div>
    )}
  </div>
);
  }

    // builds 24 horizontal hour lines
  const hourLines = [];
  for (let i = 0; i < 24; i = i + 1) {
    hourLines.push(
      <div
        key={i}
        style={{
          position: "absolute",
          top: i * 60 + "px",
          left: 0,
          right: 0,
          borderTop: "1px solid lightgray",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "50px",
            fontSize: "12px",
            fontFamily: "Monospace",
          }}
        >
          {formatHour(i)}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {/* side bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh",
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
              backgroundColor:
                location.pathname === "/psw/schedule"
                  ? "#64a449"
                  : "transparent",
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

      {/* main content */}
      <div
       style={{
          flex: 1,
          padding: "20px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontFamily: "Monospace",
            color: "#7ed957",
            textAlign: "center",
          }}
        >
          PSW Schedule
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "8px",
            width: "100%",
            marginTop: "20px",
          }}
        >
          {dayButtons}
        </div>

        <div
          style={{
            overflowY: "scroll",
            height: "500px",
            marginTop: "20px",
            border: "1px solid #eee",
          }}
        >
          <div
            style={{
              position: "relative",
              height: "1440px",
            }}
          >
            {hourLines}
            {renderedTasks}
          </div>
        </div>
      </div>
    </div>
  );
}