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

const GoogleMapPackage = () => {
  const position = { lat: 53.54992, lng: 10.00678 };
  const [darkMode, setDarkMode] = useState(false);
  const [locations, setLocations] = useState([]);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={position}
        defaultZoom={15}
        mapId="d6a6aad9821eda26"
        colorScheme={darkMode ? "DARK" : null}
        style={{ height: "100vh" }}
        onClick={(e) => {
          // show infoWindow at the clicked position
          setInfoWindowPosition({
            lat: e.detail.latLng.lat,
            lng: e.detail.latLng.lng,
          });

          //   console.log(locations);
          //   debugger;
          //   const newLocation = {
          //     name: "New Marker",
          //     position: {
          //       lat: e.detail.latLng.lat,
          //       lng: e.detail.latLng.lng,
          //     },
          //   };

          //   setLocations((prevLocations) => [...prevLocations, newLocation]);
        }}
      >
        {locations.map((location, index) => (
          <AdvancedMarker key={index} position={location.position}>
            <Pin
              background={"#FBBC04"}
              glyphColor={"#000"}
              borderColor={"#000"}
            />
          </AdvancedMarker>
        ))}

        {infoWindowPosition ? (
          <InfoWindow
            position={infoWindowPosition}
            onCloseClick={() => setInfoWindowPosition(null)}
          >
            <InfoWindowForm />
          </InfoWindow>
        ) : null}

        {/* <AdvancedMarker position={position}>
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker> */}
      </Map>
    </APIProvider>
  );
};

export default GoogleMapPackage;
