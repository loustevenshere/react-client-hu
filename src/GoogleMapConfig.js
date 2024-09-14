export const mapStartPoint = {
  lat: 39.965519,
  lng: -75.181053,
};

export const mapFeatures = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { visibility: "on" }, // Hide roads
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      { visibility: "on" }, // Hide administrative borders
    ],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      { visibility: "on" }, // Hide the general landscape
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      { visibility: "on" }, // Hide parks unless considered culturally significant
    ],
  },
  {
    featureType: "poi.place_of_worship",
    elementType: "geometry",
    stylers: [
      { visibility: "on" }, //
    ],
  },
  {
    featureType: "poi.attraction",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.business",
    elementType: "geometry",
    stylers: [
      { visibility: "off" }, // Hide business locations
    ],
  },
  {
    featureType: "poi.business",
    elementType: "labels",
    stylers: [{ visibility: "off" }], // Also hide business labels
  },
  {
    featureType: "poi.school",
    elementType: "geometry",
    stylers: [{ visibility: "off" }], // Hide schools if not needed
  },
  {
    featureType: "poi.medical",
    elementType: "geometry",
    stylers: [{ visibility: "off" }], // Hide medical facilities
  },
  {
    featureType: "poi.government",
    elementType: "geometry",
    stylers: [{ visibility: "off" }], // Hide government buildings
  },
  {
    featureType: "poi.sports_complex",
    elementType: "geometry",
    stylers: [{ visibility: "off" }], // Hide sports complexes if not needed
  },
];
