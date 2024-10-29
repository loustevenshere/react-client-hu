import { useState, useEffect } from "react";

export const useGeolocation = (
  defaultLocation = { lat: 40.7128, lng: -74.006 }
) => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting current location", error);
          setLoading(false);
          setCurrentLocation(defaultLocation);
        }
      );
    } else {
      console.log("Not Available");
      setLoading(false);
      setCurrentLocation(defaultLocation);
    }
  }, [defaultLocation]);

  return { currentLocation, loading };
};
