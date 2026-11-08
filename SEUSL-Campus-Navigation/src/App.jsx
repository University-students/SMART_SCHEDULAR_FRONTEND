import { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import './App.css';

import L from 'leaflet';

const campusCenter = [7.296968, 81.850029];

const locations = [
  {
    id: 1,
    name: 'SEUSL Main Campus',
    category: 'Campus',
    position: [7.296968, 81.850029],
    description: 'University Park, Oluvil'
  },
  {
    id: 2,
    name: 'Faculty of Technology',
    category: 'Faculty',
    position: [7.29783, 81.86068],
    description: 'Faculty of Technology, SEUSL'
  },
  {
    id: 3,
    name: 'Faculty of Engineering',
    category: 'Faculty',
    description: 'Oluvil Main Campus'
  },
  {
    id: 4,
    name: 'Main Library',
    category: 'Library',
    description: 'Ashraff Memorial Library, Oluvil'
  },
  {
    id: 5,
    name: 'University Administration',
    category: 'Administration',
    description: 'University Administration, Oluvil'
  },
  {
    id: 6,
    name: 'Main Auditorium',
    category: 'Facilities',
    description: 'University Main Auditorium, Oluvil'
  }
];

const pinIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

function MapController({ selected }) {
  const map = useMap();

  useEffect(() => {
    if (selected?.position) {
      map.flyTo(selected.position, 17, { duration: 1 });
    }
  }, [selected, map]);

  return null;
}

function App() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(locations[0]);
  const [userPosition, setUserPosition] = useState(null);
  const [locationMessage, setLocationMessage] = useState('');

  const filteredLocations = locations.filter((place) =>
    `${place.name} ${place.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function showMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage('Your browser does not support location access.');
      return;
    }

    setLocationMessage('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [
          position.coords.latitude,
          position.coords.longitude
        ];

        setUserPosition(coords);
        setLocationMessage('Your location is displayed on the map.');
      },
      () => {
        setLocationMessage(
          'Location access was denied or unavailable. Check browser permissions.'
        );
      }
    );
  }

  function openDirections(place) {
    const destination = place.position
      ? `${place.position[0]},${place.position[1]}`
      : encodeURIComponent(
          `${place.name}, South Eastern University of Sri Lanka, Oluvil`
        );

    const origin = userPosition
      ? `&origin=${userPosition[0]},${userPosition[1]}`
      : '';

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}${origin}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>SEUSL NAV</h2>
            <span>Campus Navigation</span>
          </div>
        </div>

        <div className="sidebar-label">MENU</div>

        <button className="nav-item active">
          <span>⌖</span> Campus Map
        </button>

        <a className="nav-item" href="#places">
          <span>▦</span> Places Directory
        </a>

        <a className="nav-item" href="#directions">
          <span>➤</span> Directions
        </a>

        <div className="sidebar-bottom">
          <div className="university-card">
            <span>UNIVERSITY</span>
            <strong>South Eastern University of Sri Lanka</strong>
            <small>Oluvil, Sri Lanka</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">SMART SCHEDULAR / NAVIGATION</span>
            <h1>Campus Navigation</h1>
            <p>Explore South Eastern University of Sri Lanka</p>
          </div>

          <button className="location-button" onClick={showMyLocation}>
            ◎ My Location
          </button>
        </header>

        {locationMessage && (
          <div className="location-message">{locationMessage}</div>
        )}

        <section className="welcome-banner">
          <div>
            <span>WELCOME TO SEUSL</span>
            <h2>Find your way around campus.</h2>
            <p>
              Search university locations and explore the Oluvil campus.
            </p>
          </div>
          <div className="banner-symbol">⌖</div>
        </section>

        <section className="content-grid">
          <div className="map-section">
            <div className="section-heading">
              <div>
                <h2>Interactive Campus Map</h2>
                <p>Explore the university and nearby locations.</p>
              </div>
              <span className="map-status">● Map available</span>
            </div>

            <div className="map-wrapper">
              <MapContainer
                center={campusCenter}
                zoom={15}
                scrollWheelZoom={true}
                className="campus-map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locations
                  .filter((place) => place.position)
                  .map((place) => (
                    <Marker
                      key={place.id}
                      position={place.position}
                      icon={pinIcon}
                    >
                      <Popup>
                        <strong>{place.name}</strong>
                        <br />
                        {place.description}
                      </Popup>
                    </Marker>
                  ))}

                {userPosition && (
                  <Marker position={userPosition}>
                    <Popup>Your current location</Popup>
                  </Marker>
                )}

                <MapController selected={selected} />
              </MapContainer>
            </div>

            <p className="map-note">
              Some campus locations still need their exact coordinates
              verified. Select a place to open its Google Maps directions.
            </p>
          </div>

          <aside className="places-panel" id="places">
            <div className="section-heading">
              <div>
                <h2>Find a Place</h2>
                <p>Search campus locations</p>
              </div>
            </div>

            <div className="search-box">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search buildings, faculties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="places-list">
              {filteredLocations.map((place) => (
                <button
                  className={`place-card ${
                    selected.id === place.id ? 'selected' : ''
                  }`}
                  key={place.id}
                  onClick={() => setSelected(place)}
                >
                  <div className="place-icon">⌖</div>
                  <div className="place-info">
                    <strong>{place.name}</strong>
                    <span>{place.category}</span>
                    <small>{place.description}</small>
                  </div>
                  <span className="place-arrow">›</span>
                </button>
              ))}

              {filteredLocations.length === 0 && (
                <p className="empty-message">No matching places found.</p>
              )}
            </div>

            <div className="directions-box" id="directions">
              <span className="directions-label">SELECTED DESTINATION</span>
              <h3>{selected.name}</h3>
              <p>{selected.description}</p>
              <button
                className="directions-button"
                onClick={() => openDirections(selected)}
              >
                Get Directions <span>→</span>
              </button>
            </div>
          </aside>
        </section>

        <footer className="footer">
          <span>SEUSL Campus Navigation</span>
          <span>University Park, Oluvil, Sri Lanka</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
