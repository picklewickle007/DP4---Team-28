//initalizes patient map section of front-end
//import statments imports data storing tools from react
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
//imports for leaflet api
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

//deleting the default marrkers from leaflet as they are not compatible when used with vite
//replaces with correct ions for dropper
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
 
//creates constant for marker
const psw = [
  { id: 1, name: "PSW A", address: "123 Main St, Hamilton, Ontario" },
];

//component that draws the route on the map
function RoutingControl({ from, to, onRouteFound  }) {
  const map = useMap();
  useEffect(function() {
    if (!from || !to) return;
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng)
      ],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);
    routingControl.on('routesfound', function(e) {
      const summary = e.routes[0].summary;
      const distanceKm = (summary.totalDistance / 1000).toFixed(1);
      const minutes = Math.round(summary.totalTime / 60);
      onRouteFound({ distance: distanceKm, minutes });
    });
    return function() {
      map.removeControl(routingControl);
    };
  }, [from, to]);
  return null;
}
 
export default function PatientMap() {
  const location = useLocation();
  const [markers, setMarkers] = useState([]);
  const [patientLocation, setPatientLocation] = useState(null);
  const [selectedPsw, setSelectedPsw] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
 
  //uses Nomination API to convert adress into lat, lng coordinates and returns nothing if nothing found
  async function getCoordinates(address) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    );
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  }
 
  //function includes live gps tracking
  useEffect(function() {
    navigator.geolocation.watchPosition(
      function(position) {
        setPatientLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      function(error) {
        console.error("Geolocation error:");
      }
    );
  }, []);
 
  //builds markers for the patients locations
  let patientMarker = null;
  if (patientLocation) {
    patientMarker = (
      <Marker position={[patientLocation.lat, patientLocation.lng]}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }
 
  //builds the map markers
  useEffect(function() {
    async function buildMarkers() {
      const built = [];
      for (let i = 0; i < psw.length; i++) {
        const client = psw[i];
        const coords = await getCoordinates(client.address);
        
        //geocodes the psw adress to get their coordinates
        if (coords) {
          built.push(
            <Marker key={client.id} position={[coords.lat, coords.lng]}>
              <Popup>
                <strong>{client.name}</strong>
                <br />
                {client.address}
                <br />
                <button onClick={function() {
                  setSelectedPsw({ lat: coords.lat, lng: coords.lng });
                  setRouteInfo(null); // reset while new route loads
                }}>    
                  Get Live Location
                </button>
              </Popup>
            </Marker>
          );
        }
      }
    
      setMarkers(built);
    }
    buildMarkers();
  }, []);
 
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <style>{`
        .leaflet-routing-container {
          background-color: #325585;
          color: white;
          font-family: Monospace;
          border-radius: 12px;
          padding: 10px;
        }
        .leaflet-routing-alt {
          background-color: #325585;
          display: none;
        }
        .leaflet-routing-alternatives-container h3 {
          display: block;
        }
      `}</style>
 
      {/* Side Bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
      >
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#547aad',
          height: '650px',
          width: '200px'
        }}
        >
          <Link to="/patient" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box'
          }}
          >
            Home
            </Link>
          <Link to="/patient/schedule" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box'
          }}
          >
            Schedule
            </Link>
          <Link to="/patient/history" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box'
          }}
          >
            History
            </Link>
          <Link to="/patient/map" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: location.pathname === '/patient/map' ? '#325585' : 'transparent'
          }}
          >
            Map
            </Link>
          <Link to="/patient/settings" style={{
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
 
      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        padding: '40px' 
        }}
        >
        <h1 style={{
          color: '#547aad',
          fontSize: '60px',
          marginBottom: '20px',
          fontFamily: 'Monospace',
          paddingBottom: '20px',
          marginRight: '30px',
        }}
        >
          Map
          </h1>
 
        {/*displays eta banner and map once route info is availble*/}
        {routeInfo && (
        <div style={{
        backgroundColor: '#547aad',
        color: 'white',
        fontFamily: 'Monospace',
        borderRadius: '12px',
        padding: '20px 20px',
        marginBottom: '12px',
        fontSize: '30px',
        display: 'flex',
        gap: '30px'
      }}
      >
    <span>📍 Distance: {routeInfo.distance} km</span>
    <span>⏱ ETA: {routeInfo.minutes} min</span>
  </div>
)}
 {/*Centers the map on Hamilton and zooms in at level 13*/}
        <MapContainer
          center={[43.2557, -79.8711]}
          zoom={13}
          style={{
            height: '600px',
            width: '100%',
            borderRadius: '12px'
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />
          
          {/*Loads map titles and makes all the psw markers and patient location*/}
          {markers}
          {patientMarker}
          {patientLocation && selectedPsw && (
          <RoutingControl
            from={patientLocation}
            to={selectedPsw}
            onRouteFound={setRouteInfo}
        />
      )}
        </MapContainer>
      </div>
    </div>
  );
}
