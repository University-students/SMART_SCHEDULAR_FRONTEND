import { useState, useMemo, useEffect } from 'react';
import '../App.css';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet';

import L from 'leaflet';
import { Navigation, LocateFixed } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import LocationCard from '../components/LocationCard';

import 'leaflet/dist/leaflet.css';

const campusCenter = [7.296968, 81.850029];

const locations = [
  {
    id: 1,
    name: 'SEUSL Main Campus',
    category: 'Campus',
    description: 'South Eastern University of Sri Lanka',
    position: campusCenter
  },
  {
    id: 2,
    name: 'Faculty of Technology',
    category: 'Faculty',
    description: 'Faculty of Technology, Oluvil',
    position: [7.29783, 81.86068]
  }
];

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
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

function CampusMap() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('Campus Map');

  const filteredLocations = useMemo(() => {
    return locations.filter((location) =>
      `${location.name} ${location.category}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const goToMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPosition = [
          position.coords.latitude,
          position.coords.longitude
        ];

        setSelected({
          name: 'My Current Location',
          category: 'Your Location',
          position: userPosition
        });
      },
      () => {
        alert('Unable to get your location. Please allow location access.');
      }
    );
  };

  const openDirections = () => {
    if (!selected?.position) return;

    const [latitude, longitude] = selected.position;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      '_blank'
    );
  };

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="main-content">
        <header className="top-header">
          <div>
            <h1>Campus Navigation</h1>
            <p>Explore South Eastern University of Sri Lanka</p>
          </div>

          <button className="current-location-btn" onClick={goToMyLocation}>
            <LocateFixed size={18} />
            My Location
          </button>
        </header>

        <section className="welcome-banner">
          <div>
            <h2>Explore Your Campus</h2>
            <p>
              Find faculties, buildings and important places around
              the SEUSL campus.
            </p>
          </div>
          <Navigation size={45} />
        </section>

        <div className="map-layout">
          <section className="locations-panel">
            <h2>Find Locations</h2>

            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            <div className="location-list">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    onSelect={setSelected}
                    isSelected={selected?.id === location.id}
                  />
                ))
              ) : (
                <p className="empty-message">No locations found.</p>
              )}
            </div>

            {selected?.position && (
              <button
                className="directions-btn"
                onClick={openDirections}
              >
                <Navigation size={18} />
                Get Directions
              </button>
            )}
          </section>

          <section className="map-panel">
            <MapContainer
              center={campusCenter}
              zoom={16}
              scrollWheelZoom={true}
              className="campus-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController selected={selected} />

              {locations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.position}
                  icon={markerIcon}
                >
                  <Popup>
                    <strong>{location.name}</strong>
                    <br />
                    {location.category}
                  </Popup>
                </Marker>
              ))}

              {selected?.name === 'My Current Location' && (
                <Marker
                  position={selected.position}
                  icon={markerIcon}
                >
                  <Popup>My Current Location</Popup>
                </Marker>
              )}
            </MapContainer>
          </section>
        </div>
      </main>
    </div>
  );
}

export default CampusMap;