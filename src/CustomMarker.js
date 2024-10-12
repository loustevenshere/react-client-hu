import React, { useState } from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

const typeColors = {
  personal: "bg-blue-500",
  work: "bg-green-500",
  project: "bg-purple-500",
  default: "bg-gray-500",
};

export const CustomMarker = ({ location }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const baseStyles =
    "transition-all duration-300 ease-in-out rounded-lg shadow-md cursor-pointer";
  const expandedStyles = isExpanded ? "w-48 h-auto" : "w-32 h-8";
  const typeColor = typeColors[location.type] || typeColors.default;

  return (
    <AdvancedMarker position={location.position}>
      <div
        className={`${baseStyles} ${expandedStyles} ${typeColor} text-white p-2`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
      >
        <h3 className="font-bold text-sm truncate">{location.title}</h3>
        {isExpanded && (
          <p className="text-xs mt-2 overflow-hidden transition-all duration-300 ease-in-out">
            {location.description}
          </p>
        )}
      </div>
    </AdvancedMarker>
  );
};
