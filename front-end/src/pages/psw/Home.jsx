import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function PSWHome() {
  const [activeButton, setActiveButton] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [queue, setQueue] = useState([]);
  const [emergencyQueue, setEmergencyQueue] = useState([]);
  const [isQueueLoading, setIsQueueLoading] = useState(false);
  const [isFinishingJob, setIsFinishingJob] = useState(false);
  const [isAlertsLoading, setIsAlertsLoading] = useState(false);
  const location = useLocation();

  const loadEmergencySummary = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/psw-home/queue/emergencies?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Could not load alerts.');
      }

      setEmergencyQueue(data);
    } catch {
      setEmergencyQueue([]);
    }
  };

  useEffect(() => {
    loadEmergencySummary();
  }, []);

  const loadQueue = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in first.');
      return;
    }

    setIsQueueLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/psw-home/queue?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Could not load pending requests.');
      }

      setQueue(data);
      setDialogType('queue');
      setActiveButton('queue');
    } catch (error) {
      alert(error.message || 'Could not connect to the server.');
    } finally {
      setIsQueueLoading(false);
    }
  };

  const loadAlerts = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in first.');
      return;
    }

    setIsAlertsLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/psw-home/queue/emergencies?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Could not load alerts.');
      }

      setEmergencyQueue(data);
      setDialogType('alerts');
      setActiveButton('emergency');
    } catch (error) {
      alert(error.message || 'Could not connect to the server.');
    } finally {
      setIsAlertsLoading(false);
    }
  };

  const handleFinishJob = async (type) => {
    const token = localStorage.getItem('token');
    const nextPatient = type === 'alerts' ? emergencyQueue[0] : queue[0];

    if (!token) {
      alert('Please log in first.');
      return;
    }

    if (!nextPatient) {
      return;
    }

    setIsFinishingJob(true);

    try {
      const endpoint =
        type === 'alerts'
          ? `http://localhost:8000/psw-home/queue/emergency/complete/${nextPatient.id}?token=${token}`
          : `http://localhost:8000/psw-home/queue/complete/${nextPatient.id}?token=${token}`;

      const response = await fetch(
        endpoint,
        { method: 'POST' },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Could not finish the job.');
      }

      if (type === 'alerts') {
        setEmergencyQueue((currentQueue) => currentQueue.slice(1));
      } else {
        setQueue((currentQueue) => currentQueue.slice(1));
      }
      alert(data.message || 'Job finished.');
    } catch (error) {
      alert(error.message || 'Could not connect to the server.');
    } finally {
      setIsFinishingJob(false);
    }
  };

  const closeQueueDialog = () => {
    setDialogType(null);
    setActiveButton(null);
  };

  const warningIcon = (
    <div
      style={{
        width: '54px',
        height: '48px',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        backgroundColor: '#f5d94f',
        position: 'relative',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '11px',
          width: '8px',
          height: '18px',
          borderRadius: '999px',
          backgroundColor: '#25323a',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          width: '8px',
          height: '8px',
          borderRadius: '999px',
          backgroundColor: '#25323a',
        }}
      />
    </div>
  );

  const dialogItems = dialogType === 'alerts' ? emergencyQueue : queue;
  const isAlertDialog = dialogType === 'alerts';
  const dialogHeading = isAlertDialog ? 'Alerts' : 'Pending Requests';
  const dialogEmptyText = isAlertDialog
    ? 'No emergency alerts are currently waiting.'
    : 'No non-emergency requests are currently waiting.';
  const nameColor = isAlertDialog ? '#8f1d1d' : '#2e5a1e';
  const addressColor = isAlertDialog ? '#9f4a4a' : '#48643d';
  const actionColor = isAlertDialog ? '#b82525' : '#64a449';
  const headingColor = isAlertDialog ? '#b82525' : '#64a449';

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
            boxSizing: 'border-box',
            backgroundColor: location.pathname === '/psw' ? '#64a449' : 'transparent'
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
            boxSizing: 'border-box'
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
      <div style={{ flex: 1, padding: '40px' }}>
        <h1 style={{
          color: '#7ed957',
          fontSize: '50px',
          marginBottom: '20px',
          fontFamily: 'Monospace',
          paddingRight: '220px'
        }}>Welcome, {localStorage.getItem('name')}</h1>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          paddingLeft: '50px',
          alignItems: 'center',
          paddingTop: '80px',
          gap: '100px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '60px'
          }}>
            <button onClick={() => setActiveButton(activeButton === 'schedule' ? null : 'schedule')}
              style={{
                width: '400px',
                height: '200px',
                backgroundColor: activeButton === 'schedule' ? '#64a449' : '#7ed957',
                fontFamily: 'DM Sans',
                color: 'white',
                cursor: 'pointer',
                border: 'none',
                fontSize: '40px',
                borderRadius: '30px'
              }}>
              Check in
            </button>
            <button
              onClick={loadQueue}
              style={{
                width: '400px',
                height: '200px',
                backgroundColor: activeButton === 'queue' ? '#64a449' : '#7ed957',
                fontFamily: 'DM Sans',
                color: 'white',
                cursor: isQueueLoading ? 'wait' : 'pointer',
                border: 'none',
                borderRadius: '30px',
                opacity: isQueueLoading ? 0.85 : 1,
              }}>
              <span style={{ fontSize: '40px' }}> Pending </span>
              <br />
              <span style={{ fontSize: '40px' }}>
                {isQueueLoading ? 'Loading...' : 'Requests'}
              </span>
            </button>
          </div>
          <button onClick={loadAlerts}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              backgroundColor: activeButton === 'emergency' ? '#8f1d1d' : '#b82525',
              fontFamily: 'DM Sans',
              color: 'white',
              cursor: isAlertsLoading ? 'wait' : 'pointer',
              border: 'none',
              fontSize: '24px',
              opacity: isAlertsLoading ? 0.85 : 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}>
            {emergencyQueue.length > 0 && warningIcon}
            {isAlertsLoading ? 'Loading...' : 'ALERTS'}
          </button>
        </div>
      </div>

      {dialogType && (
        <div
          onClick={closeQueueDialog}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: 'min(720px, 100%)',
              maxHeight: '80vh',
              overflowY: 'auto',
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: headingColor,
                  fontFamily: 'DM Sans',
                  fontSize: '38px',
                }}
              >
                {dialogHeading}
              </h2>
              <button
                onClick={closeQueueDialog}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans',
                }}
              >
                Close
              </button>
            </div>

            {dialogItems.length === 0 ? (
              <p style={{ fontFamily: 'DM Sans', fontSize: '22px', margin: 0 }}>
                {dialogEmptyText}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {dialogItems.map((request, index) => (
                  <div
                    key={request.id}
                    style={{
                      border: 'none',
                      borderRadius: '18px',
                      padding: '18px 20px',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: 'DM Sans',
                            fontSize: '28px',
                            color: nameColor,
                            fontWeight: '700',
                          }}
                        >
                          {index + 1}. {request.patient_name}
                        </div>
                        <div
                          style={{
                            fontFamily: 'DM Sans',
                            fontSize: '18px',
                            color: addressColor,
                            marginTop: '6px',
                          }}
                        >
                          {request.address}
                        </div>
                      </div>

                      {index === 0 && (
                        <button
                          onClick={() => handleFinishJob(dialogType)}
                          disabled={isFinishingJob}
                          style={{
                            minWidth: '150px',
                            padding: '12px 18px',
                            borderRadius: '12px',
                            border: 'none',
                            backgroundColor: actionColor,
                            color: 'white',
                            fontFamily: 'DM Sans',
                            fontSize: '18px',
                            cursor: isFinishingJob ? 'wait' : 'pointer',
                            opacity: isFinishingJob ? 0.8 : 1,
                          }}
                        >
                          {isFinishingJob ? 'Finishing...' : 'Finish Job'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
