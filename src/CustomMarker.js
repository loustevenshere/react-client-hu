import React, { useState } from "react";
import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

const typeColors = {
  personal: "bg-blue-500",
  work: "bg-green-500",
  project: "bg-purple-500",
  default: "bg-gray-500",
};

const MarkerInfoWindow = ({ location, marker, onClose }) => {
  return (
    <InfoWindow anchor={marker} onClose={onClose} className="p-2">
      <div className="flex items-center mb-2">
        <div
          className={`w-4 h-4 rounded-full ${
            typeColors[location.type] || typeColors.default
          } mr-2`}
        ></div>
        <h3 className="text-lg font-semibold text-black">{location.title}</h3>
      </div>
      <p className="text-sm text-gray-700 mb-2">{location.description}</p>
      <p className="text-sm font-semibold text-gray-900">{location.type}</p>
    </InfoWindow>
  );
};

export const CustomMarker = ({ location, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const baseStyles =
    "transition-all duration-300 ease-in-out rounded-lg shadow-md cursor-pointer";
  const expandedStyles = isExpanded ? "w-48 h-auto" : "w-32 h-8";
  const typeColor = typeColors[location.type] || typeColors.default;

  const handleMarkerClick = (e) => {
    // e.domEvent.stopPropagation();
    // e.domEvent.preventDefault();
    console.log(e, "Marker clicked");
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
