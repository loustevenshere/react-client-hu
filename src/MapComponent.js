import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";
import RecenterMap from "./RecenterMap";

function MapComponent() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState(null);

  const [currentPosition, setCurrentPosition] = useState([51.505, -0.09]);

  useEffect(() => {
    // Check if the browser supports geolocation
    if (navigator.geolocation) {
      // Get the current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          console.log("New Position Set:", position);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    // Fetch saved locations from the backend
    axios.get("/api/locations").then((response) => {
      setLocations(response.data);
    });
  }, []);

  function LocationMarker() {
    useMapEvents({
      // when the map is clicked set this piece of state
      click(e) {
        setNewLocation(e.latlng);
      },
    });

    return newLocation === null ? null : (
      <Marker position={newLocation}>
        <Popup>
          <div>
            <h3>Add New Location</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Title" name="title" required />
              <textarea placeholder="Description" name="description" required />
              <button type="submit">Save</button>
            </form>
          </div>
        </Popup>
      </Marker>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;

    const locationData = {
      latitude: newLocation.lat,
      longitude: newLocation.lng,
      title: title,
      description: description,
    };

    // Save to the backend
    axios.post("/api/locations", locationData).then((response) => {
      setLocations([...locations, response.data]);
      setNewLocation(null);
    });
  }

  return (
    <MapContainer
      center={currentPosition}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
      options={{ zoomDelta: 0.5 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <RecenterMap center={currentPosition} />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            <h3>{location.title}</h3>
            <p>{location.description}</p>
          </Popup>
        </Marker>
      ))}
      <LocationMarker />
    </MapContainer>
  );
}

export default MapComponent;
