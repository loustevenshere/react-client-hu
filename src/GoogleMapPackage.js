import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import InfoWindowForm from "./InfoWindowForm";
import { CustomMarker } from "./CustomMarker";

const GoogleMapPackage = () => {
  const position = { lat: 53.54992, lng: 10.00678 };
  const [darkMode, setDarkMode] = useState(false);
  const [locations, setLocations] = useState([]);
  const [formInfoWindowPosition, setFormInfoWindowPosition] = useState(null);
  const [markerInfoPosition, setMarkerInfoPosition] = useState(null);

  // TODO
  // Marker should show infoWindow when clicked
  // InfoWindow should close when X button is clicked OR when map is clicked
  // Form should NOT show when Marker Info window is open
  // commit

  const showMarkerInfo = (location) => {
    console.log(location);
  };

  const handleMapClick = (e) => {
    setFormInfoWindowPosition({
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
    });
  };

  const saveLocation = (newLocation) => {
    setLocations((prev) => [...prev, newLocation]);
    setFormInfoWindowPosition(null);
  };

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={position}
        defaultZoom={15}
        mapId="d6a6aad9821eda26"
        colorScheme={darkMode ? "DARK" : null}
        style={{ height: "100vh" }}
        onClick={handleMapClick}
      >
        {locations.map((location, index) => (
          <CustomMarker key={index} location={location} />
        ))}

        {formInfoWindowPosition ? (
          <InfoWindow
            position={formInfoWindowPosition}
            onCloseClick={() => setFormInfoWindowPosition(null)}
          >
            <InfoWindowForm
              infoWindowPosition={formInfoWindowPosition}
              onSubmit={saveLocation}
            />
          </InfoWindow>
        ) : null}
      </Map>
    </APIProvider>
  );
};

export default GoogleMapPackage;
