import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Import Sign Up Page
import Signup from './pages/Signup';

// Import Login Page
import Login from './pages/Login';

// Import Patient Pages
import PatientHome from './pages/patient/Home';
import PatientSchedule from './pages/patient/Schedule';
import PatientHistory from './pages/patient/History';
import PatientMap from './pages/patient/Map';
import PatientSettings from './pages/patient/Settings';

import { useState } from 'react';

// Import PSW Pages

import PSWHome from './pages/psw/Home';
import PSWSchedule from './pages/psw/Schedule';
import PSWHistory from './pages/psw/History';
import PSWMap from './pages/psw/Map';
import PSWSettings from './pages/psw/Settings';


function App() {
  const [activeButton, setActiveButton] = useState(null);
  return (
    <Router>
      <Routes>
        {/*Default: redirect to sign up */}
        <Route path="/" element={<Navigate to='/signup' />} />

        {/* Sign Up Route */}
        <Route path="/signup" element={<Signup />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Patient Routes */}
        <Route path="/patient" element={<PatientHome />} />
        <Route path="/patient/schedule" element={<PatientSchedule />} />
        <Route path="/patient/history" element={<PatientHistory />} />
        <Route path="/patient/map" element={<PatientMap />} />
        <Route path="/patient/settings" element={<PatientSettings />} />

        {/* PSW Routes */}
        <Route path="/psw" element={<PSWHome />} />
        <Route path="/psw/schedule" element={<PSWSchedule />} />
        <Route path="/psw/history" element={<PSWHistory />} />
        <Route path="/psw/map" element={<PSWMap />} />
        <Route path="/psw/settings" element={<PSWSettings />} />
      </Routes>
    </Router>
  );
}

export default App;