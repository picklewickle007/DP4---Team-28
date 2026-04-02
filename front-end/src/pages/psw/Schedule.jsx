import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function PSWSchedule() {
  const [tasks, setTasks] = useState([]);
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = [];
  for (let i = 0; i < 7; i += 1) {
    const tempDate = new Date();
    tempDate.setDate(tempDate.getDate() + i);
    weekDays.push(tempDate);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function formatHour(hour) {
    if (hour === 0) {
      return "12am";
    }
    if (hour < 12) {
      return `${hour}am`;
    }
    if (hour === 12) {
      return "12pm";
    }
    return `${hour - 12}pm`;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:8000/schedule/psw?token=${token}`)
      .then((res) => res.json())
      .then(async (data) => {
        const normalized = await Promise.all(
          data.map(async (task) => {
            const patientRes = await fetch(`http://localhost:8000/patients-login/${task.patient_id}`);
            const patient = await patientRes.json();
            return {
              ...task,
              startTime: task.start_time,
              time: task.duration,
              patient_name: patient.name,
            };
          }),
        );
        setTasks(normalized);
      });
  }, []);

  const dayButtons = [];
  for (let i = 0; i < 7; i += 1) {
    const date = weekDays[i];

    function getBgColour() {
      return selectedDate.toDateString() === date.toDateString()
        ? "#7ed957"
        : "lightgray";
    }

    function getTextColor() {
      return selectedDate.toDateString() === date.toDateString()
        ? "white"
        : "black";
    }

    dayButtons.push(
      <div key={date.toDateString()} style={{ flex: 1 }}>
        <button
          onClick={() => setSelectedDate(date)}
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
          <div style={{ fontSize: "20px" }}>{dayNames[date.getDay()]}</div>
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
      </div>,
    );
  }

  const filteredTasks = [];
  for (let i = 0; i < tasks.length; i += 1) {
    const task = tasks[i];
    if (task.date === selectedDate.toLocaleDateString("en-CA")) {
      filteredTasks.push(task);
    }
  }

  return (
    <div style={{ display: "flex" }}>
      {/* Side Bar */}
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

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <h1 style={{ fontFamily: "Monospace", color: "#7ed957" }}>
            PSW Schedule
          </h1>
        </div>

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

        <div style={{ overflowY: "scroll", height: "500px" }}>
          <div style={{ position: "relative", height: `${24 * 60}px` }}>
            {/* Hour lines */}
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: `${i * 60}px`,
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
            ))}

            {/* Tasks */}
            {filteredTasks.map((task) => {
              const [hourStr, minStr] = (task.startTime || "0:0").split(":");
              const startMinutes =
                parseInt(hourStr, 10) * 60 + parseInt(minStr, 10);
              const duration = parseInt(task.time, 10) || 30;

              return (
                <div
                  key={task.id}
                  style={{
                    position: "absolute",
                    top: `${startMinutes}px`,
                    left: "55px",
                    right: "10px",
                    height: `${duration}px`,
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
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{task.task} - {task.patient_name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
