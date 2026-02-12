# Map Component - Usage Examples

## Basic Usage

### In Any Page Component

```tsx
import { Map } from "@/components/event-halls/map";

export default function EventHallsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Find Event Halls</h1>
      <Map />
    </div>
  );
}
```

### With Custom Height

```tsx
import { Map } from "@/components/event-halls/map";

export default function FullScreenMap() {
  return (
    <div className="h-screen w-full">
      {/* Change h-96 to h-screen in map.tsx for full screen */}
      <Map />
    </div>
  );
}
```

### In a Dashboard Layout

```tsx
import { Map } from "@/components/event-halls/map";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <div>
        <h2>Hall List</h2>
        {/* Your list component */}
      </div>
      <div>
        <h2>Location Map</h2>
        <Map />
      </div>
    </div>
  );
}
```

### With Loading State

```tsx
"use client";
import { Map } from "@/components/event-halls/map";
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <h1>Event Halls</h1>
      <Suspense fallback={<div>Loading map...</div>}>
        <Map />
      </Suspense>
    </div>
  );
}
```

## Adding Location Links to Database

### Using Prisma Studio

1. Run: `npx prisma studio`
2. Navigate to `event_halls` table
3. Edit the `location_link` field
4. Add Google Maps URL with coordinates

### Programmatically

```typescript
import prisma from "@/lib/prisma";

// Add location link to existing event hall
await prisma.event_halls.update({
  where: { id: 1 },
  data: {
    location_link: "https://maps.google.com/?q=47.9184,106.9177",
  },
});

// Create new event hall with location
await prisma.event_halls.create({
  data: {
    name: "Grand Hall",
    location: "Ulaanbaatar, Mongolia",
    location_link: "https://maps.google.com/?q=47.9184,106.9177",
    capacity: "500",
    // ... other fields
  },
});
```

## Getting Google Maps Coordinates

### Method 1: From Google Maps Website

1. Go to https://maps.google.com
2. Find your location
3. Right-click on the exact spot
4. Click on the coordinates (e.g., "47.9184, 106.9177")
5. Copy the coordinates
6. Format as: `https://maps.google.com/?q=47.9184,106.9177`

### Method 2: Share Link

1. Find location on Google Maps
2. Click "Share" button
3. Copy the link (e.g., `https://maps.app.goo.gl/...`)
4. Open link in browser to get full URL with coordinates
5. Extract coordinates from URL

### Method 3: From Address Bar

1. Navigate to location on Google Maps
2. Look at URL in address bar
3. Find coordinates after `@` symbol
4. Example: `https://www.google.com/maps/@47.9184,106.9177,15z`

## Customization Examples

### Change Map Height

In `map.tsx`, line 164:

```tsx
<div className="relative h-screen w-full rounded-lg overflow-hidden shadow-lg">
  {/* h-96 = 384px, h-screen = full viewport */}
```

### Different Tile Provider (Map Style)

In `map.tsx`, replace TileLayer:

```tsx
{
  /* Dark Theme */
}
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
/>;

{
  /* Satellite View */
}
<TileLayer
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  attribution="Tiles &copy; Esri"
/>;
```

### Custom Marker Color

Create colored marker icon:

```tsx
const redIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
```

Available colors: blue, red, green, orange, yellow, violet, grey, black

## Testing

### Test with Sample Data

```typescript
// Add test event halls with locations
const testHalls = [
  {
    name: "Central Plaza",
    location: "Downtown Ulaanbaatar",
    location_link: "https://maps.google.com/?q=47.9184,106.9177",
  },
  {
    name: "Sky Tower Hall",
    location: "Sukhbaatar District",
    location_link: "https://maps.google.com/?q=47.9220,106.9150",
  },
  {
    name: "Garden Events",
    location: "Bayanzurkh District",
    location_link: "https://maps.google.com/?q=47.9100,106.9400",
  },
];
```

## Troubleshooting

### Map shows but no markers

- Check database: `SELECT id, name, location_link FROM event_halls;`
- Ensure `location_link` contains coordinates
- Check browser console for parsing errors

### Markers in wrong location

- Verify coordinates format: latitude first, then longitude
- Example: `47.9184,106.9177` (lat,lng)

### Map not responsive

- Ensure parent container has defined width
- Add `w-full` class to parent div

## Live Example

Visit your app at:

```
http://localhost:3000/event-halls
```

Or wherever you've imported the `<Map />` component.
