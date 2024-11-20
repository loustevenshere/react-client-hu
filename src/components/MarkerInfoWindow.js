import { InfoWindow } from "@vis.gl/react-google-maps";

const typeColors = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  default: "bg-gray-500",
};

const MarkerInfoWindow = ({ location, marker, onClose }) => {
  return (
    <InfoWindow anchor={marker} onClose={onClose} className="p-2">
      <div className="flex items-center mb-2">
        <div
          className={`w-4 h-4 rounded-full justify-center ${
            typeColors[location.type] || typeColors.default
          } mr-2`}
        ></div>
        <h3 className="text-lg font-semibold text-black">{location.title}</h3>
      </div>
      <p className="text-sm text-gray-700 mb-2">{location.description}</p>
    </InfoWindow>
  );
};

export default MarkerInfoWindow;
