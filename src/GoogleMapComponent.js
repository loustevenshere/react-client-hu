import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axiosInstance from "./axiosconfig";

import * as styles from "./GoogleMapStyles";
import { mapStartPoint, mapFeatures } from "./GoogleMapConfig";

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  const [locationMarkers, setLocationMarkers] = useState([]); // from BE
  const [selectedLocation, setSelectedLocation] = useState(null); // active user selected location
  const [showLocationForm, setShowLocationForm] = useState(false); // InfoWindow state
  const [formData, setFormData] = useState({ title: "", description: "" }); // formData
  const [loadError, setLoadError] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false); // To check if the map should render
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    // fetch locations on page load
    fetchLocations();
  }, []);

  const handleRetry = () => {
    setLoadError(null);
  };

  const fetchLocations = async () => {
    // fetches saved locations from BE
    try {
      const response = await axiosInstance.get("/api/locations");
      setLocationMarkers(response.data);
      setIsMapReady(true); // Set map ready when data is fetched
    } catch (error) {
      console.error("Error fetching locations", error);
      setIsMapReady(true); // Set map ready when data is fetched
    }
  };

  const saveLocation = async (newLocation) => {
    // saves locations and puts them into state
    try {
      const response = await axiosInstance.post("/api/locations", newLocation);
      setLocationMarkers((prevMarkers) => [...prevMarkers, response.data]);
    } catch (error) {
      console.error("Error saving location", error);
    }
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setSelectedLocation({ lat, lng }); // sets the selected location
    setShowLocationForm(true); // shows the info window
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

      await saveLocation(locationData); // saves location data

      setShowInfoWindow(false); // closes infowindow
      setFormData({ title: "", description: "" });
      setSelectedLocation(null);
    }
  };

  return (
    <div style={styles.mapWrapperStyle}>
      {loadError ? (
        <div>
          <p>Error loading map. Please try again.</p>
          <button onClick={handleRetry} style={styles.buttonStyle}>
            Load Map
          </button>
        </div>
      ) : (
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          onError={(error) => {
            setLoadError(error);
            console.error("Error loading google maps", error);
          }}
        >
          <GoogleMap
            mapContainerStyle={styles.mapContainerStyle}
            zoom={13}
            center={mapStartPoint}
            onLoad={onLoad}
            onClick={handleMapClick}
            options={{
              disableDefaultUI: true,
              styles: mapFeatures,
            }}
          >
            {locationMarkers.map((marker, index) => {
              console.log(marker);
              return (
                <Marker
                  key={index}
                  position={{ lat: marker.latitude, lng: marker.longitude }}
                  onClick={(event) => {
                    setActiveMarker(marker);
                    setShowInfoWindow(true);
                  }}
                ></Marker>
              );
            })}

            {showInfoWindow && activeMarker && (
              <InfoWindow
                position={{
                  lat: activeMarker.latitude,
                  lng: activeMarker.longitude,
                }}
                onCloseClick={() => {
                  setActiveMarker(null);
                  setShowInfoWindow(false);
                }}
              >
                <div style={styles.infoWindowStyle}>
                  <h3 style={styles.headingStyle}>{activeMarker.title}</h3>
                  <p>{activeMarker.description}</p>
                </div>
              </InfoWindow>
            )}

            {/* Show the form as an InfoWindow when a location is selected */}
            {showLocationForm && selectedLocation && (
              <InfoWindow
                position={selectedLocation}
                onCloseClick={() => setShowLocationForm(false)}
              >
                <div style={styles.infoWindowStyle}>
                  <h3 style={styles.headingStyle}>Add a Location</h3>
                  <form onSubmit={handleFormSubmit} style={styles.formStyle}>
                    <div style={styles.formGroupStyle}>
                      <label style={styles.labelStyle}>Title:</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                        style={styles.inputStyle}
                      />
                    </div>
                    <div style={styles.formGroupStyle}>
                      <label style={styles.labelStyle}>Description:</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        required
                        style={{
                          ...styles.inputStyle,
                          height: "90px",
                          resize: "none",
                        }}
                      />
                    </div>
                    <button type="submit" style={styles.buttonStyle}>
                      Add Location
                    </button>
                  </form>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default GoogleMapComponent;
