import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import InfoWindowForm from "./InfoWindowForm";
import { CustomMarker } from "./CustomMarker";
import axiosInstance from "../config/axiosconfig";

const GoogleMapPackage = () => {
  // const [darkMode, setDarkMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const [locations, setLocations] = useState([]);
  const [formInfoWindowPosition, setFormInfoWindowPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  // COLOR TODO:
  // Style marker info window to look clean
  // Change color in formData

  // TODO - ideas
  // FE Design
  // style infowindow form - think about design
  // style marker info window - closer there I believe
  // change zoom on click?
  // hover state over markers??
  // Form should not grow greater with size
  // Add button to go back to current location

  // BE - TODO
  // DELETE a location
  // UPDATE a location

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log(
            "Current Location",
            position.coords.latitude,
            position.coords.longitude
          );
          setLoading(false);
        },
        (error) => {
          console.error("Error getting current location", error);
          setLoading(false);
          setCurrentLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    } else {
      console.log("Not Available");
      setLoading(false);
      setCurrentLocation({ lat: 40.7128, lng: -74.006 });
    }
  }, []);

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

  if (loading) {
    return <div>Loading Map...</div>;
  }

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={currentLocation}
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
