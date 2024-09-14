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

  // const onPlacesChanged = () => {
  //   const place = autoCompleteRef.current.getPlace();
  //   if (place.geometry) {
  //     setLocationMarkers([
  //       {
  //         lat: place.geometry.location.lat(),
  //         lng: place.geometry.location.lng(),
  //       },
  //     ]);

  //     // center map to the selected place
  //     mapRef.current.panTo(place.geometry.location);
  //   }
  // };

  return (
    <div style={styles.mapWrapperStyle}>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
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
                        height: "100px",
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
    </div>
  );
};

export default GoogleMapComponent;
