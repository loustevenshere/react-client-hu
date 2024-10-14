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

const MarkerInfoWindow = ({ location, marker }) => {
  return (
    <InfoWindow anchor={marker} className="p-2">
      <h3 className="text-lg font-semibold text-black">{location.title}</h3>
      <p className="text-sm text-black">{location.description}</p>
      <p className="text-sm font-semibold text-black">{location.type}</p>
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

  return (
    <AdvancedMarker
      position={location.position}
      onClick={(e) => setIsExpanded(!isExpanded)}
      ref={markerRef}
    >
      <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
      {isExpanded && <MarkerInfoWindow location={location} marker={marker} />}
    </AdvancedMarker>
  );
};
