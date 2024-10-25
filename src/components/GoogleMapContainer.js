import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import InfoWindowForm from "./InfoWindowForm";
import { CustomMarker } from "./CustomMarker";
import axiosInstance from "../config/axiosconfig";

const GoogleMapPackage = () => {
  const position = { lat: 53.54992, lng: 10.00678 };
  // const [darkMode, setDarkMode] = useState(false);
  const [locations, setLocations] = useState([]);
  const [formInfoWindowPosition, setFormInfoWindowPosition] = useState(null);

  // TODO
  // FE Design
  // style infowindow form - think about design
  // style marker info window - closer there I believe
  // change zoom on click?
  // hover state over markers??

  // BE - TODO
  // Lets get save working with h2 database
  // Then switch to MongoDB
  // Create a new location
  // DELETE a location
  // GET all locations
  // UPDATE a location

  const fetchLocations = async () => {
    try {
      const response = await axiosInstance.get("/api/locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  };

  const saveLocation = async (newLocation) => {
    try {
      const response = await axiosInstance.post("/api/locations", newLocation);
      setLocations((prev) => [...prev, response.data]);
      setFormInfoWindowPosition(null);
    } catch (error) {
      console.error("Error saving location", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleMapClick = (e) => {
    setFormInfoWindowPosition({
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
    });
  };

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={position}
        defaultZoom={15}
        mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID}
        // colorScheme={darkMode ? "DARK" : null}
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
              onSubmit={saveLocation}
            />
          </InfoWindow>
        ) : null}
      </Map>
    </APIProvider>
  );
};

export default GoogleMapPackage;
