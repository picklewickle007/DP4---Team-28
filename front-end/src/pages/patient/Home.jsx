//Sets up patient home page's front-end 
//Import statements imports data storing tools from react
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

//Exports patient home page component so other files can use it
export default function PatientHome() {
  const [activeButton, setActiveButton] = useState(null);
  const [isInQueue, setIsInQueue] = useState(false);
  const [isQueueLoading, setIsQueueLoading] = useState(true);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  useEffect(() => {
    const token = localStorage.getItem("token");

    //If not logged in, skip the fetch
    if (!token) {
      setIsQueueLoading(false);
      return;
    }

    fetch(`https://dp4-team-28-production.up.railway.app/home/queue/status/?token=${token}`)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Could not load queue status.");
        }

        const inQueue = Boolean(data.in_queue);
        const isEmergency = inQueue && data.patient?.priority === 1;

        setIsInQueue(inQueue && !isEmergency);
        setIsEmergencyActive(isEmergency);
        setActiveButton(isEmergency ? "emergency" : inQueue ? "queue" : null);
      })
      .catch((error) => {
        alert(error.message || "Could not connect to the server.");
      })
      .finally(() => {
        setIsQueueLoading(false);
      });
  }, []);
//Handles joining or leaving the PSW queue
  const handleQueueToggle = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    setIsQueueLoading(true);

    try {
      const response = await fetch(
        `https://dp4-team-28-production.up.railway.app/home/queue/?token=${token}`,
        {
          method: isInQueue ? "DELETE" : "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Queue request failed.");
      }

      const nextInQueue = !isInQueue;
      setIsInQueue(nextInQueue);
      setIsEmergencyActive(false);
      setActiveButton(nextInQueue ? "queue" : null);

      if (nextInQueue) {
        alert(
          "You're in the queue and the next available PSW is on their way.",
        );
      } else {
        alert("You have left the queue.");
      }
    } catch (error) {
      alert(error.message || "Could not connect to the server.");
    } finally {
      setIsQueueLoading(false);
    }
  };
//Handles activating or cancelling emergency alerts
  const handleEmergencyToggle = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    setIsQueueLoading(true);

    try {
      const endpoint = isEmergencyActive
        ? `https://dp4-team-28-production.up.railway.app/home/queue/?token=${token}`
        : `https://dp4-team-28-production.up.railway.app/home/queue/emergency/?token=${token}`;

      const response = await fetch(endpoint, {
        method: isEmergencyActive ? "DELETE" : "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Emergency request failed.");
      }
//Cancels the emergency and clears all queue states
      if (isEmergencyActive) {
        setIsEmergencyActive(false);
        setIsInQueue(false);
        setActiveButton(null);
        alert(
          "Emergency request cancelled. You have been removed from the queue.",
        );
      } else {
        setIsEmergencyActive(true);
        setIsInQueue(false);
        setActiveButton("emergency");
        alert("Emergency alert sent. A PSW will arrive as soon as possible.");
      }
    } catch (error) {
      alert(error.message || "Could not connect to the server.");
    } finally {
      setIsQueueLoading(false);
    }
  };

  //Sidebar elements
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
          {/* Darken the Home slot in sidebar if currently on /patient */}
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
              backgroundColor:
                location.pathname === "/patient" ? "#325585" : "transparent",
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
    {/* Main content area */}
    {/* Display text at the top of the page, customized to the patient username */}
      <div style={{ flex: 1, padding: "40px" }}>
        <h1
          style={{
            color: "#547aad",
            fontSize: "50px",
            marginBottom: "20px",
            fontFamily: "Monospace",
          }}
        >
          Welcome, {name}!
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingLeft: "50px",
            alignItems: "center",
            paddingTop: "80px",
            gap: "100px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "60px",
            }}
          >
          {/* Action buttons: Add to Schedule, Join queue, Emergency */}
            <button
              onClick={() =>
                navigate("/patient/schedule", { state: { openForm: true } })
              }
              style={{
                width: "400px",
                height: "200px",
                backgroundColor:
                  activeButton === "schedule" ? "#325585" : "#547aad",
                fontFamily: "DM Sans",
                color: "white",
                cursor: "pointer",
                border: "none",
                fontSize: "40px",
                borderRadius: "30px",
              }}
            >
              Add To Schedule
            </button>
            <button
              onClick={handleQueueToggle}
              disabled={isQueueLoading || isEmergencyActive}
              style={{
                width: "400px",
                height: "200px",
                backgroundColor: isInQueue ? "#325585" : "#547aad",
                fontFamily: "DM Sans",
                color: "white",
                cursor:
                  isQueueLoading || isEmergencyActive
                    ? "not-allowed"
                    : "pointer",
                border: "none",
                borderRadius: "30px",
                opacity: isQueueLoading || isEmergencyActive ? 0.8 : 1,
              }}
            >
              <span style={{ fontSize: "40px" }}>
                {isQueueLoading
                  ? "Loading..."
                  : isInQueue
                    ? "Leave Queue"
                    : "Call PSW"}
              </span>
              <br />
              <span style={{ fontSize: "24px" }}>
                {isQueueLoading
                  ? "Checking queue status"
                  : isEmergencyActive
                    ? "Unavailable during emergency"
                    : isInQueue
                      ? "Click to leave the queue"
                      : "Click to join queue"}
              </span>
            </button>
          </div>
          <button
            onClick={handleEmergencyToggle}
            disabled={isQueueLoading}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              backgroundColor: isEmergencyActive ? "#8f1d1d" : "#b82525",
              fontFamily: "DM Sans",
              color: "white",
              cursor: isQueueLoading ? "wait" : "pointer",
              border: "none",
              fontSize: "24px",
              opacity: isQueueLoading ? 0.8 : 1,
            }}
          >
            {isEmergencyActive ? "CANCEL" : "EMERGENCY"}
          </button>
        </div>
      </div>
    </div>
  );
}