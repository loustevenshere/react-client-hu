import { useState, useEffect } from "react";
import {
  fetchLocationsFromAPI,
  saveLocationToAPI,
} from "../../service/locationservice";

export const useLocations = () => {
  const [locations, setLocations] = useState([]);

  const fetchLocations = async () => {
    try {
      const data = await fetchLocationsFromAPI();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  };

  const saveLocation = async (newLocation) => {
    try {
      const savedLocation = await saveLocationToAPI(newLocation);
      setLocations((prev) => [...prev, savedLocation]);
      return savedLocation;
    } catch (error) {
      console.error("Error saving location", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return { locations, saveLocation };
};
