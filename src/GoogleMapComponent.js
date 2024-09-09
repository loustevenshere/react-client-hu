import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  height: "100vh",
  width: "100%",
};

const center = {
  lat: 39.965519,
  lng: -75.181053,
};

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  const autoCompleteRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/locations")
      .then((response) => {
        setMarkers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching locations data", error);
      });
  }, []);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setSelectedLocation({ lat, lng });
    setShowInfoWindow(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (formData.title && formData.description) {
      const locationData = {
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        title: formData.title,
        description: formData.description,
      };

      axios.post();
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        { lat: selectedLocation.lat, lng: selectedLocation.lng, ...formData },
      ]);
    }

    setShowInfoWindow(false);
    setFormData({ title: "", description: "" });
    setSelectedLocation(null);
  };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onPlacesChanged = () => {
    const place = autoCompleteRef.current.getPlace();
    if (place.geometry) {
      setMarkers([
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
      libraries={["places"]}
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
        {markers.map((marker, index) => (
          <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }}>
            {/* Display an InfoWindow for each marker with its title and description */}
            <InfoWindow position={{ lat: marker.lat, lng: marker.lng }}>
              <div>
                <h4>{marker.title}</h4>
                <p>{marker.description}</p>
              </div>
            </InfoWindow>
          </Marker>
        ))}

        {/* Show the form as an InfoWindow when a location is selected */}
        {showInfoWindow && selectedLocation && (
          <InfoWindow
            position={selectedLocation}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div>
              <h3>Add a Location</h3>
              <form onSubmit={handleFormSubmit}>
                <div>
                  <label>Title:</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button type="submit">Add Location</button>
              </form>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
