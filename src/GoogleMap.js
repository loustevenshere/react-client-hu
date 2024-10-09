import { Wrapper } from "@googlemaps/react-wrapper";
import { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";

export default function GoogleMap() {
  return (
    <Wrapper
      apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={["marker"]}
      version="beta"
      onLoad={() => console.log("Google Maps API loaded")}
      onError={(error) => console.error("Error loading Google Maps API", error)}
    >
      <MyMap />
    </Wrapper>
  );
}

const mapOptions = {
  mapId: "d6a6aad9821eda26",
  center: { lat: 43.66293, lng: -79.39314 },
  zoom: 10,
  disableDefaultUI: true,
};

function MyMap() {
  const [map, setMap] = useState();
  const ref = useRef();

  useEffect(() => {
    if (!map) {
      const mapInstance = new window.google.maps.Map(ref.current, mapOptions);
      setMap(mapInstance);

      // event listener is not working on map

      // add handleMapClick function here
      const handleMapClick = (e) => {
        debugger;
        console.log("Map clicked", e.latLng.toJSON());
      };

      mapInstance.addListener("click", handleMapClick);

      return () => {
        if (mapInstance) {
          window.google.maps.event.clearInstanceListeners(mapInstance);
        }
      };
    }
  }, [map]);

  // function handleMapClick(e) {
  //   debugger;
  //   const newMarkerPosition = {
  //     lat: e.latLng.lat(),
  //     lng: e.latLng.lng(),
  //   };

  //   const newMarker = (
  //     <Marker
  //       key={JSON.stringify(newMarkerPosition)}
  //       map={map}
  //       position={newMarkerPosition}
  //       onClick={() => console.log("Marker clicked:", newMarkerPosition)}
  //     >
  //       <div className="marker">
  //         <h2>New Marker</h2>
  //       </div>
  //     </Marker>
  //   );

  //   setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  // }

  const [markers, setMarkers] = useState([]);

  return (
    <>
      <div ref={ref} id="map" style={{ height: "100vh", width: "100%" }} />
      {map && <UserLocations map={map} />}
    </>
  );
}

const locations = [
  {
    name: "Lou",
    position: { lat: 43.66293, lng: -79.39314 },
    climate: "Raining",
  },
  {
    name: "Tina",
    position: { lat: 43.544811, lng: -80.248108 },
    climate: "Cloudy",
  },
  {
    name: "Indie & Beau",
    position: { lat: 43.919239, lng: -80.097412 },
    climate: "Sunny",
  },
];

const UserLocations = ({ map }) => {
  const [data, setData] = useState(locations);
  const [highlight, setHighlight] = useState();
  const [editing, setEditing] = useState();

  return (
    <>
      {editing && (
        <Editing
          weather={data[editing]}
          update={(newWeather) => {
            setData((existing) => {
              return { ...existing, [editing]: { ...newWeather } };
            });
          }}
          close={() => setEditing(null)}
        />
      )}
      {data.map((location, key) => (
        <Marker
          key={key}
          map={map}
          position={location.position}
          onClick={() => setEditing(key)}
        >
          <div
            className={`marker ${location.climate.toLowerCase()} ${
              highlight === key || editing === key ? "highlight" : ""
            }`}
            onMouseEnter={() => setHighlight(key)}
            onMouseLeave={() => setHighlight(null)}
          >
            <h2>{location.name}</h2>
            {highlight === key || editing === key ? (
              <div className="five-day">
                <p>Im highlighted</p>
              </div>
            ) : null}
          </div>
        </Marker>
      ))}
    </>
  );
};

function Editing({ weather, update, close }) {
  return (
    <div className="editing">
      <h2>Editing {weather.name}</h2>

      <label htmlFor="climate">Climate</label>
      <select
        id="climate"
        value={weather.climate}
        onChange={(e) => update({ ...weather, climate: e.target.value })}
      >
        {["Sunny", "Cloudy", "Raining"].map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>

      <label htmlFor="temp">Temperature</label>
      <input
        id="temp"
        type="number"
        value={weather.temp}
        onChange={(e) => update({ ...weather, temp: e.target.value })}
      />

      <button type="button" onClick={() => close()}>
        Close
      </button>
    </div>
  );
}

function Marker({ map, position, children, onClick }) {
  const rootRef = useRef();
  const markerRef = useRef();

  useEffect(() => {
    if (!rootRef.current) {
      const container = document.createElement("div");
      rootRef.current = createRoot(container);

      markerRef.current = new window.google.maps.marker.AdvancedMarkerView({
        position,
        content: container,
      });
    }

    return () => (markerRef.current.map = null);
  }, []);

  useEffect(() => {
    rootRef.current.render(children);
    markerRef.current.position = position;
    markerRef.current.map = map;
    const listener = markerRef.current.addListener("click", onClick);
    return () => listener.remove();
  }, [map, position, children, onClick]);
}
