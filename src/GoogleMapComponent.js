import React, { useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";

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
          <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
