import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import Patient Pages
import PatientHome from './pages/patient/Home';
import PatientSchedule from './pages/patient/Schedule';
import PatientHistory from './pages/patient/History';
import PatientMap from './pages/patient/Map';
import PatientSettings from './pages/patient/Settings';

// Import PSW Pages
/*
import PSWHome from './pages/psw/Home';
import PSWSchedule from './pages/psw/Schedule';
import PSWHistory from './pages/psw/History';
import PSWMap from './pages/psw/Map';
import PSWSettings from './pages/psw/Settings';
*/

function App() {
  return (
    <Router>
      <nav>
        <strong>Patient:</strong>
        <Link to="/patient">Home</Link>
        <Link to="/patient/schedule">Schedule</Link>
        <Link to="/patient/history">History</Link>
        <Link to="/patient/map">Map</Link>
        <Link to="/patient/settings">Settings</Link>
        
        <span style={{ margin: '0 20px', borderLeft: '1px solid #ccc' }}></span>
        
        <strong>PSW:</strong>
        <Link to="/psw">Home</Link>
        <Link to="/psw/schedule">Schedule</Link>
        <Link to="/psw/history">History</Link>
        <Link to="/psw/map">Map</Link>
        <Link to="/psw/settings">Settings</Link>
      </nav>

      <main style={{ padding: '20px' }}>
        <Routes>
          {/* Patient Routes */}
          <Route path="/patient" element={<PatientHome />} />
          <Route path="/patient/schedule" element={<PatientSchedule />} />
          <Route path="/patient/history" element={<PatientHistory />} />
          <Route path="/patient/map" element={<PatientMap />} />
          <Route path="/patient/settings" element={<PatientSettings />} />

          {/* PSW Routes */}
          {/* <Route path="/psw" element={<PSWHome />} />
          <Route path="/psw/schedule" element={<PSWSchedule />} />
          <Route path="/psw/history" element={<PSWHistory />} />
          <Route path="/psw/map" element={<PSWMap />} />
          <Route path="/psw/settings" element={<PSWSettings />} /> */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;