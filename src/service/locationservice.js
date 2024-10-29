import axiosInstance from "../config/axiosconfig";

export const fetchLocationsFromAPI = async () => {
  try {
    const response = await axiosInstance.get("/api/locations");
    return response.data;
  } catch (error) {
    console.error("Error fetching locations", error);
  }
};

export const saveLocationToAPI = async (newLocation) => {
  try {
    const response = await axiosInstance.post("/api/locations", newLocation);
    return response.data;
  } catch (error) {
    console.error("Error saving location", error);
  }
};
