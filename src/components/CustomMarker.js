import React, { useState } from "react";
import {
  AdvancedMarker,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import MarkerInfoWindow from "./MarkerInfoWindow";

export const CustomMarker = ({ location }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const handleMarkerClick = (e) => {
    setIsExpanded(!isExpanded);
  };

  return (
    <AdvancedMarker
      position={location.position}
      onClick={handleMarkerClick}
      ref={markerRef}
      onCloseClick={() => setIsExpanded(false)}
    >
      <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
      {isExpanded && (
        <MarkerInfoWindow
          location={location}
          marker={marker}
          onClose={() => {
            setIsExpanded(false);
          }}
        />
      )}
    </AdvancedMarker>
  );
};
