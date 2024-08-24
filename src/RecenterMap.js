import { useEffect } from "react";
import { useMap } from "react-leaflet";

function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center);
    }
  }, [center, map]);

  return null;
}

export default RecenterMap;
