import { useEffect, useState } from "react"; //imports react libraies
import { Link, useLocation } from "react-router-dom";
export default function PatientSchedule() {
  //makes components avaliable to use in other files
  const [tasks, setTasks] = useState([]);
  //sets tasks as an empty array can be updated with set tasks
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  //creates selected data variable and starts at todays date can be updated by setselected date
  const [showForm, setShowForm] = useState(false);
  //creates variable that starts with the form is hidden
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskStartTime, setStartTime] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [showOther1, setShowOther1] = useState(false);
  const [showOther2, setShowOther2] = useState(false);
  const [error, setError] = useState(""); // Stores error message if fields are empty
  //These store the values of the form inputs for the new task (name, date, time) and start as empty strings

  const weekDays = []; //array for dates
  for (let i = 0; i < 7; i = i + 1) {
    //for loop for days
    const tempDate = new Date(); //sets first date to be today
    tempDate.setDate(tempDate.getDate() + i); //adds next 7 days
    weekDays.push(tempDate); //adds that date to array of dates
  }

  const hours = []; //same thing but for hours
  for (let i = 0; i < 24; i = i + 1) {
    hours.push(i);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function formatHour(hour) {
    if (hour === 0) {
      return "12am";
    } else if (hour < 12) {
      return hour + "am";
    } else if (hour === 12) {
      return "12pm";
    } else {
      return hour - 12 + "pm";
    }
  }

  useEffect(function () {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/schedule/?token=${token}`)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setTasks(data);
      });
  }, []);

  useEffect(function() {
    if (location.state && location.state.openForm) {
        setShowForm(true);
    }
}, []);

  // Function to handle validation and POST request
  async function handleSubmit() {
    if (!taskName || !taskDate || !taskStartTime || !taskTime || taskName === "Select Task Type") {
      setError("Please fill in all fields before submitting.");
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8000/schedule/?token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: taskName,
          date: taskDate,
          startTime: taskStartTime,
          time: taskTime,
        }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      setError(data.detail || "Failed to add task.");
      return;
    }

    // Refresh the task list after adding
    const updatedRes = await fetch(
      `http://localhost:8000/schedule/?token=${token}`,
    );
    const updatedData = await updatedRes.json();
    setTasks(updatedData);

    // Close the form
    setShowForm(false);
    setError("");
  }

  const dayButtons = [];
  for (let i = 0; i < 7; i = i + 1) {
    const date = weekDays[i]; //grabs date from array of dates

    function getBgColour() {
      if (selectedDate.toDateString() === date.toDateString()) {
        return "#547aad";
      } else {
        return "lightgray";
      }
    }

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
        {" "}
        {/* gives each button equal width */}
        <button
          onClick={function () {
            setSelectedDate(date);
          }} //when clicked updates selected button
          style={{
            backgroundColor: getBgColour(),
            color: getTextColor(),
            display: "flex", //controls how lines up
            flexDirection: "column", //organizes in column (day then date)
            alignItems: "center", //centers items in column
            padding: "12px 0",
            justifyContent: "center", //centers items in box
            borderRadius: "12px", //makes rounded corners
            border: "none", //removes border (aka no ugly black line :))
            cursor: "pointer", //makes it clickable (yay)
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
      </div>,
    );
  }

  const filteredTasks = [];
  for (let i = 0; i < tasks.length; i = i + 1) {
    const task = tasks[i];
    if (task.date === selectedDate.toLocaleDateString("en-CA")) {
      //converts it to back-end format
      filteredTasks.push(task);
    }
  }

  const timeRows = [];
  for (let i = 0; i < 24; i = i + 1) {
    // Find tasks that start in this specific hour
    const tasksForThisHour = [];
    for (let j = 0; j < filteredTasks.length; j++) {
      const t = filteredTasks[j];
      const hourPart = parseInt(t.startTime ? t.startTime.split(":")[0] : -1);
      if (hourPart === i) {
        tasksForThisHour.push(t);
      }
    }

    timeRows.push(
      <div
        key={i}
        style={{
          height: "60px",
          borderTop: "1px solid lightgray",
          display: "flex",
          position: "relative", // Allows absolute positioning for task blocks
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
          {tasksForThisHour.map(function (task) {
            const minutesPast = parseInt(task.startTime.split(":")[1]) || 0;
            const duration = parseInt(task.time) || 30;
            return (
              <div
                key={task.id}
                style={{
                  position: "absolute",
                  top: minutesPast + "px",
                  left: "5px",
                  right: "10px",
                  height: duration + "px",
                  backgroundColor: "#547aad",
                  color: "white",
                  borderRadius: "8px",
                  padding: "4px",
                  fontSize: "12px",
                  zIndex: 10,
                  fontFamily: "Monospace",
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

  const taskItems = []; //holds items for filtered tasks
  for (let i = 0; i < filteredTasks.length; i = i + 1) {
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
          onChange={function (event) {
            setTaskTime(event.target.value);
          }}
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
          onChange={function (event) {
            setTaskName(event.target.value);
          }}
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
        {/* Error message shown at the top of the form */}
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
            onChange={function (event) {
              setTaskName(event.target.value);
              if (event.target.value === "other") {
                setShowOther2(true);
              } else {
                setShowOther2(false);
              }
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
            onChange={function (event) {
              setTaskDate(event.target.value);
            }}
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
            onChange={function (event) {
              setStartTime(event.target.value);
            }}
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
            onChange={function (event) {
              setTaskTime(event.target.value);
              if (event.target.value === "other") {
                setShowOther1(true);
              } else {
                setShowOther1(false);
              }
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
            onClick={function () {
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
              colour: "black",
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
              onClick={function () {
                setShowForm(true);
              }}
            >
              +
            </button>
            <p style={{ fontFamily: "Monospace", color: "#547aad" }}>
              {" "}
              Add to Schedule{" "}
            </p>
          </div>
          <h1 style={{ fontFamily: "Monospace", color: "#547aad" }}>
            Patient Schedule
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row", //days side by side
            gap: "8px",
            width: "100%",
            marginTop: "20px",
          }}
        >
          {dayButtons}
        </div>

        <div
          style={{
            overflowY: "scroll", //you can scroll if there are too many hours to fit in box
            height: "500px",
          }}
        >
          {timeRows}
        </div>

        <div>
          <ul>{taskItems}</ul>
        </div>
      </div>
    </div>
  );
}
