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

  const showMarkerInfo = (location) => {
    console.log(location);
  };

  const handleMapClick = (e) => {
    console.log(e, "Map clicked");
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
        mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID}
        colorScheme={darkMode ? "DARK" : null}
        style={{ height: "100vh" }}
        onClick={handleMapClick}
        gestureHandling={"cooperative"}
        setClickableIcons={false}
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
