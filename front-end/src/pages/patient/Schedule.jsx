import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function PatientSchedule() {
  const [tasks, setTasks] = useState([]);
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(location.state?.openForm || false);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskStartTime, setStartTime] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [showOther1, setShowOther1] = useState(false);
  const [showOther2, setShowOther2] = useState(false);
  const [error, setError] = useState("");

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

    if (!token) {
      return;
    }

    fetch(`http://localhost:8000/schedule/?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((task) => ({
          ...task,
          startTime: task.start_time,
          time: task.duration,
        }));
        setTasks(normalized);
      });
  }, []);

  function handleSubmit() {
    if (
      !taskName ||
      !taskDate ||
      !taskStartTime ||
      !taskTime ||
      taskName === "Select Task Type"
    ) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in first.");
      return;
    }

    const newTask = {
      task: taskName,
      date: taskDate,
      start_time: taskStartTime,
      duration: taskTime,
    };

    fetch(`http://localhost:8000/schedule/?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks([
          ...tasks,
          { ...data, startTime: taskStartTime, time: taskTime },
        ]);
        setShowForm(false);
        setError("");
        setTaskName("");
        setTaskDate("");
        setStartTime("");
        setTaskTime("");
      })
      .catch(() => {
        setError("Server error: Could not save task.");
      });
  }

  const dayButtons = [];
  for (let i = 0; i < 7; i += 1) {
    const date = weekDays[i];

    function getBgColour() {
      return selectedDate.toDateString() === date.toDateString()
        ? "#547aad"
        : "lightgray";
    }

    function getTextColor() {
      return selectedDate.toDateString() === date.toDateString()
        ? "white"
        : "black";
    }

    dayButtons.push(
      <div
        key={date.toDateString()}
        style={{
          flex: 1,
        }}
      >
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

  const timeRows = [];
  for (let i = 0; i < 24; i += 1) {
    const tasksForThisHour = [];
    for (let j = 0; j < filteredTasks.length; j += 1) {
      const task = filteredTasks[j];
      const hourPart = parseInt(
        task.startTime ? task.startTime.split(":")[0] : -1,
        10,
      );
      if (hourPart === i) {
        tasksForThisHour.push(task);
      }
    }

    timeRows.push(
      <div
        key={i}
        style={{
          height: "60px",
          borderTop: "1px solid lightgray",
          display: "flex",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "50px",
            fontSize: "12px",
            color: "Black",
            fontFamily: "Monospace",
          }}
        >
          {formatHour(i)}
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          {tasksForThisHour.map((task) => {
            const minutesPast = parseInt(
              task.startTime?.split(":")[1] || 0,
              10,
            );
            const duration = parseInt(task.time, 10) || 30;

            return (
              <div
                key={task.id}
                style={{
                  position: "absolute",
                  top: `${minutesPast}px`,
                  left: "5px",
                  right: "10px",
                  height: `${duration}px`,
                  backgroundColor: "#547aad",
                  color: "white",
                  borderRadius: "8px",
                  padding: "4px",
                  fontSize: "12px",
                  zIndex: 10,
                  fontFamily: "Monospace",
                  border: "2px solid black",
                }}
              >
                {task.task}
              </div>
            );
          })}
        </div>
      </div>,
    );
  }

  const taskItems = [];
  for (let i = 0; i < filteredTasks.length; i += 1) {
    const task = filteredTasks[i];
    taskItems.push(
      <li key={task.id} style={{ fontFamily: "Monospace" }}>
        {task.task} - {task.time}
      </li>,
    );
  }

  let customTimeInput = null;
  if (showOther1) {
    customTimeInput = (
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontFamily: "Monospace" }}>
          Insert Custom Task Time (in minutes):
        </p>
        <input
          type="number"
          onChange={(event) => setTaskTime(event.target.value)}
          style={{
            width: "100%",
            height: "40px",
            borderRadius: "8px",
            border: "1px solid lightgray",
            padding: "0 8px",
            boxSizing: "border-box",
            fontFamily: "Monospace",
          }}
        />
      </div>
    );
  }

  let customTaskInput = null;
  if (showOther2) {
    customTaskInput = (
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontFamily: "Monospace" }}>Insert Custom Task:</p>
        <input
          type="text"
          onChange={(event) => setTaskName(event.target.value)}
          style={{
            width: "100%",
            height: "40px",
            borderRadius: "8px",
            border: "1px solid lightgray",
            padding: "0 8px",
            boxSizing: "border-box",
            fontFamily: "Monospace",
          }}
        />
      </div>
    );
  }

  if (showForm) {
    return (
      <div
        style={{
          padding: "40px",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        {error && (
          <p
            style={{
              color: "red",
              fontWeight: "bold",
              fontFamily: "Monospace",
            }}
          >
            {error}
          </p>
        )}

        <h1 style={{ marginBottom: "30px", fontFamily: "Monospace" }}>
          Add New Task
        </h1>

        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontFamily: "Monospace" }}>Required Task</p>
          <select
            onChange={(event) => {
              setTaskName(event.target.value);
              setShowOther2(event.target.value === "other");
            }}
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "8px",
              border: "1px solid lightgray",
              padding: "0 12px",
              fontFamily: "Monospace",
            }}
          >
            <option value="Select Task Type">Select Task</option>
            <option value="Personal Hygiene">Personal Hygiene</option>
            <option value="Dressing">Dressing</option>
            <option value="Undressing">Undressing</option>
            <option value="Meal Preparation">Meal Preparation</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="other">Other</option>
          </select>
        </div>

        {customTaskInput}

        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontFamily: "Monospace" }}>Insert Date:</p>
          <input
            type="date"
            onChange={(event) => setTaskDate(event.target.value)}
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "8px",
              border: "1px solid lightgray",
              padding: "0 8px",
              boxSizing: "border-box",
              fontFamily: "Monospace",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontFamily: "Monospace" }}>Insert Start Time:</p>
          <input
            type="time"
            onChange={(event) => setStartTime(event.target.value)}
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "8px",
              border: "1px solid lightgray",
              padding: "0 8px",
              boxSizing: "border-box",
              fontFamily: "Monospace",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontFamily: "Monospace" }}>Select Estimated Task Time:</p>
          <select
            onChange={(event) => {
              setTaskTime(event.target.value);
              setShowOther1(event.target.value === "other");
            }}
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "8px",
              border: "1px solid lightgray",
              padding: "0 12px",
              fontFamily: "Monospace",
            }}
          >
            <option value="">Select Task Time</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
            <option value="other">Other</option>
          </select>
        </div>

        {customTimeInput}

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "30px",
          }}
        >
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              height: "45px",
              backgroundColor: "#547aad",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              fontFamily: "Monospace",
            }}
          >
            Submit Task
          </button>

          <button
            onClick={() => {
              setShowForm(false);
              setError("");
            }}
            style={{
              flex: 1,
              height: "45px",
              backgroundColor: "lightgray",
              color: "black",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              fontFamily: "Monospace",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
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
            backgroundColor: "#547aad",
            height: "650px",
            width: "200px",
          }}
        >
          <Link
            to="/patient"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "36px",
              padding: "50px 20px",
              borderBottom: "5px solid #325585",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            Home
          </Link>
          <Link
            to="/patient/schedule"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "36px",
              padding: "50px 20px",
              borderBottom: "5px solid #325585",
              width: "100%",
              boxSizing: "border-box",
              backgroundColor:
                location.pathname === "/patient/schedule"
                  ? "#325585"
                  : "transparent",
            }}
          >
            Schedule
          </Link>
          <Link
            to="/patient/history"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "36px",
              padding: "50px 20px",
              borderBottom: "5px solid #325585",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            History
          </Link>
          <Link
            to="/patient/map"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "36px",
              padding: "50px 20px",
              borderBottom: "5px solid #325585",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            Map
          </Link>
          <Link
            to="/patient/settings"
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "absolute",
              left: "0",
              marginBottom: "20px",
              color: "black",
            }}
          >
            <button
              style={{
                borderRadius: "50%",
                width: "70px",
                height: "70px",
                backgroundColor: "#547aad",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "24px",
                fontFamily: "Monospace",
              }}
              onClick={() => setShowForm(true)}
            >
              +
            </button>
            <p style={{ fontFamily: "Monospace", color: "#547aad" }}>
              Add to Schedule
            </p>
          </div>
          <h1 style={{ fontFamily: "Monospace", color: "#547aad" }}>
            Patient Schedule
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
                    backgroundColor: "#547aad",
                    color: "white",
                    borderRadius: "8px",
                    padding: "4px",
                    fontSize: "12px",
                    zIndex: 10,
                    fontFamily: "Monospace",
                    border: "0.5px solid lightgray",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {task.task}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
