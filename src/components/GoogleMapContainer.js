import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import InfoWindowForm from "./InfoWindowForm";
import { CustomMarker } from "./CustomMarker";
import { useGeolocation } from "./hooks/useGeolocation";
import { useLocations } from "./hooks/useLocations";
const GoogleMapPackage = () => {
  const { currentLocation, loading } = useGeolocation();
  const { locations, saveLocation } = useLocations();
  const [formInfoWindowPosition, setFormInfoWindowPosition] = useState(null);

  const handleSaveLocation = async (newLocation) => {
    try {
      await saveLocation(newLocation);
      setFormInfoWindowPosition(null);
    } catch (error) {
      console.error("Error saving location", error);
    }
  };

  const handleMapClick = (e) => {
    setFormInfoWindowPosition({
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
    });
  };

  if (loading) {
    return <div>Loading Map...</div>;
  }

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={currentLocation}
        defaultZoom={15}
        mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID}
        style={{ height: "100vh" }}
        onClick={handleMapClick}
        gestureHandling={"cooperative"}
        setClickableIcons={false}
      >
        {locations.map((location, index) => {
          if (!location?.position?.lat || !location?.position?.lng) {
            return null;
          }
          return <CustomMarker key={index} location={location} />;
        })}

        {formInfoWindowPosition ? (
          <InfoWindow
            position={formInfoWindowPosition}
            onCloseClick={() => setFormInfoWindowPosition(null)}
          >
            <InfoWindowForm
              infoWindowPosition={formInfoWindowPosition}
              onSubmit={handleSaveLocation}
            />
          </InfoWindow>
        ) : null}
      </Map>
    </APIProvider>
  );
};

export default GoogleMapPackage;
