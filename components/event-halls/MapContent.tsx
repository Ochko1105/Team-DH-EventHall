"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { LocateFixed, MousePointerClick, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EventHall {
  id: number;
  name: string;
  location: string | null;
  location_link: string | null;
  description: string | null;
  capacity: string | null;
  images: string[];
}

// Fix for default marker icon in Next.js
const createCustomIcon = () => {
  if (typeof window !== "undefined") {
    return L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }
  return null;
};

// Component to adjust map bounds
function MapBounds({
  locations,
}: {
  locations: { lat: number; lng: number }[];
}) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });

      if (locations.length === 1) {
        map.setZoom(13);
      }
    }
  }, [locations, map]);

  return null;
}

// Extract coordinates from Google Maps link
const extractCoordinates = (
  locationLink: string | null
): { lat: number; lng: number } | null => {
  if (!locationLink) return null;

  try {
    // Priority 1: Try !3d (latitude) and !4d (longitude) pattern - most accurate for place markers
    const preciseLatPattern = /!3d(-?\d+\.?\d*)/;
    const preciseLngPattern = /!4d(-?\d+\.?\d*)/;
    const preciseLatMatch = locationLink.match(preciseLatPattern);
    const preciseLngMatch = locationLink.match(preciseLngPattern);

    if (preciseLatMatch && preciseLngMatch) {
      const coords = {
        lat: parseFloat(preciseLatMatch[1]),
        lng: parseFloat(preciseLngMatch[1]),
      };
      return coords;
    }

    // Priority 2: Try q= pattern
    const coordPattern = /q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const coordMatch = locationLink.match(coordPattern);
    if (coordMatch) {
      const coords = {
        lat: parseFloat(coordMatch[1]),
        lng: parseFloat(coordMatch[2]),
      };

      return coords;
    }

    // Priority 3: Try @ pattern (fallback, less accurate - viewport center)
    const placePattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const placeMatch = locationLink.match(placePattern);
    if (placeMatch) {
      const coords = {
        lat: parseFloat(placeMatch[1]),
        lng: parseFloat(placeMatch[2]),
      };

      return coords;
    }

    console.warn("Unsupported location link format:", locationLink);
    return null;
  } catch (err) {
    console.error("Error parsing location link:", err);
    return null;
  }
};

interface MapContentProps {
  eventHalls: EventHall[];
}

// Reset View Button Component
function SnapToStartButton({
  defaultCenter,
  defaultZoom,
}: {
  defaultCenter: [number, number];
  defaultZoom: number;
}) {
  const map = useMap();

  const handleReset = () => {
    map.setView(defaultCenter, defaultZoom, {
      animate: true,
      duration: 0.5,
    });
  };

  return (
    <Button
      onClick={handleReset}
      className="absolute top-34 right-20 z-1000 bg-white hover:bg-gray-100 text-gray-800 shadow-lg w-[140px]"
      size="sm"
    >
      <LocateFixed className="h-4 w-4 mr-2" />
      Reset View
    </Button>
  );
}

// My Location Button Component
function MyLocationButton() {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15, {
          animate: true,
          duration: 0.5,
        });

        // Add a temporary marker at user's location
        const userIcon = L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        L.marker([latitude, longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();

        setIsLocating(false);
        toast.success("Located your position!");
      },
      (error) => {
        setIsLocating(false);
        let errorMessage = "Unable to retrieve your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Button
      onClick={handleMyLocation}
      disabled={isLocating}
      className="absolute top-46 right-20 z-1000 bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-50 w-[140px]"
      size="sm"
    >
      <Navigation
        className={`h-4 w-4 mr-2 ${isLocating ? "animate-pulse" : ""}`}
      />
      {isLocating ? "Locating..." : "My Location"}
    </Button>
  );
}

export default function MapContent({ eventHalls }: MapContentProps) {
  const customIcon = createCustomIcon();
  const [isMapActive, setIsMapActive] = useState(false);

  const validLocations = eventHalls
    .map((hall) => {
      const coords = extractCoordinates(hall.location_link);
      return coords ? { ...hall, coords } : null;
    })
    .filter(
      (item): item is EventHall & { coords: { lat: number; lng: number } } =>
        item !== null
    );

  const defaultCenter: [number, number] = [47.9184, 106.9177];

  if (!customIcon) {
    return (
      <div className="h-[600px] w-full bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-white">Initializing map...</div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden shadow-lg snap-start mt-20 z-10">
      {/* Click-to-activate overlay */}
      {!isMapActive && (
        <div
          onClick={() => setIsMapActive(true)}
          className="absolute inset-0 z-999 bg-black/20 backdrop-blur-[1px] flex items-center justify-center cursor-pointer group hover:bg-black/30 transition-colors"
        >
          <div className="bg-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 group-hover:scale-105 transition-transform">
            <MousePointerClick className="h-5 w-5 text-gray-700" />
            <span className="text-gray-700 font-medium">
              Click to interact with map
            </span>
          </div>
        </div>
      )}
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="h-full w-full mt-20"
        style={{ background: "#1f2937" }}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validLocations.map((hall) => (
          <Marker
            key={hall.id}
            position={[hall.coords.lat, hall.coords.lng]}
            icon={customIcon}
          >
            <Popup maxWidth={300} className="custom-popup">
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {hall.name}
                </h3>
                {hall.images && hall.images.length > 0 && (
                  <img
                    src={hall.images[0]}
                    alt={hall.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <p className="text-sm text-gray-700 mb-1">
                  <strong>📍 Location:</strong> {hall.location || "N/A"}
                </p>
                {hall.capacity && (
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>👥 Capacity:</strong> {hall.capacity}
                  </p>
                )}
                {hall.description && (
                  <p className="text-xs text-gray-600 mt-2">
                    {hall.description.substring(0, 100)}
                    {hall.description.length > 100 ? "..." : ""}
                  </p>
                )}
                {hall.location_link && (
                  <a
                    href={hall.location_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View on Google Maps →
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        <MapBounds locations={validLocations.map((h) => h.coords)} />
        <SnapToStartButton defaultCenter={defaultCenter} defaultZoom={14} />
        <MyLocationButton />
      </MapContainer>

      {validLocations.length === 0 && (
        <div className="absolute inset-0 bg-gray-800/90 flex items-center justify-center pointer-events-none z-50">
          <p className="text-gray-400">
            No event halls with locations to display
          </p>
        </div>
      )}
    </div>
  );
}
