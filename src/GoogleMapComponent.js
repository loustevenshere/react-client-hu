import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axiosInstance from "./axiosconfig";

const mapContainerStyle = {
  height: "100vh",
  width: "100%",
};

const center = {
  lat: 39.965519,
  lng: -75.181053,
};

const infoWindowStyle = {
  padding: "10px",
  width: "250px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
};

const headingStyle = {
  fontSize: "18px",
  marginBottom: "10px",
  color: "#333",
  fontWeight: "bold",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: "5px",
  fontSize: "14px",
  color: "#666",
};

const inputStyle = {
  padding: "8px",
  fontSize: "14px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "100%",
};

const buttonStyle = {
  padding: "10px",
  fontSize: "16px",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

buttonStyle[":hover"] = {
  backgroundColor: "#0056b3",
};

const googleMapLibrary = ["places"];

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  const autoCompleteRef = useRef(null);
  const [locationMarkers, setLocationMarkers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const fetchLocations = async () => {
    try {
      const response = await axiosInstance.get("/api/locations");
      setLocationMarkers(response.data);
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  };

  const saveLocation = async (newLocation) => {
    try {
      const response = await axiosInstance.post("/api/locations", newLocation);
      setLocationMarkers((prevMarkers) => [...prevMarkers, response.data]);
    } catch (error) {
      console.error("Error saving location", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setSelectedLocation({ lat, lng });
    setShowInfoWindow(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (formData.title && formData.description) {
      const locationData = {
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        title: formData.title,
        description: formData.description,
      };

      await saveLocation(locationData);

      setShowInfoWindow(false);
      setFormData({ title: "", description: "" });
      setSelectedLocation(null);
    }
  };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onPlacesChanged = () => {
    const place = autoCompleteRef.current.getPlace();
    if (place.geometry) {
      setLocationMarkers([
        {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      ]);

      // center map to the selected place
      mapRef.current.panTo(place.geometry.location);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={googleMapLibrary}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
        onLoad={onLoad}
        onClick={handleMapClick}
      >
        <Autocomplete
          onLoad={(autoComplete) => (autoCompleteRef.current = autoComplete)}
          onPlaceChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Search for places..."
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `400px`,
              height: `40px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `16px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-200px",
              top: "10px",
            }}
          />
        </Autocomplete>
        {locationMarkers.map((marker, index) => {
          return (
            <Marker
              key={index}
              position={{ lat: marker.latitude, lng: marker.longitude }}
              onClick={() => {
                setShowInfoWindow(true);
                setSelectedLocation(marker);
              }}
            >
              <InfoWindow
                position={{ lat: marker.latitude, lng: marker.longitude }}
              >
                <div>
                  <h4>{marker.title}</h4>
                  <p>{marker.description}</p>
                </div>
              </InfoWindow>
            </Marker>
          );
        })}

        {/* Show the form as an InfoWindow when a location is selected */}
        {showInfoWindow && selectedLocation && (
          <InfoWindow
            position={selectedLocation}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div style={infoWindowStyle}>
              <h3 style={headingStyle}>Add a Location</h3>
              <form onSubmit={handleFormSubmit} style={formStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Title:</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Description:</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    required
                    style={{ ...inputStyle, height: "100px", resize: "none" }}
                  />
                </div>
                <button type="submit" style={buttonStyle}>
                  Add Location
                </button>
              </form>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
