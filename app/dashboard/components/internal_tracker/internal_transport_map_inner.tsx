// app/dashboard/components/internal_tracker/internal_transport_map_inner.tsx
"use client";

import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ====== TYPE STATUS YANG BISA DI-SHARE KE TRACKER ======
export type TripStatus = "OnTrip" | "Arrived";

// ====== RUTE DUMMY (HO → PIK Avenue) ======
const route: LatLngExpression[] = [
  [-6.17924092897432, 106.81896607496975],
  [-6.179715134415434, 106.82056381033163],
  [-6.180638832373819, 106.82149290795178],
  [-6.180665999262834, 106.82265068373802],
  [-6.171231168846124, 106.82249971694772],
  [-6.167630885153409, 106.82100972083833],
  [-6.155160963583933, 106.81785998216907],
  [-6.142391737159832, 106.81454631053792],
  [-6.141131506822056, 106.81242330779529],
  [-6.139222062505014, 106.81126459351694],
  [-6.1370032583134115, 106.81169374694959],
  [-6.136661902972607, 106.81152208555099],
  [-6.136885917420195, 106.81056721916333],
  [-6.134432420682559, 106.8099771331684],
  [-6.135195796653233, 106.80712093894054],
  [-6.135995850020277, 106.80688490455259],
  [-6.1364274174743345, 106.80301962297663],
  [-6.137322900334165, 106.79318307672828],
  [-6.137296231974362, 106.7928719404896],
  [-6.132903412854626, 106.7925310761429],
  [-6.132599390942507, 106.79215556687872],
  [-6.1324122996197605, 106.79001521549498],
  [-6.132179250975729, 106.78919205630874],
  [-6.1308011884439715, 106.78269870363026],
  [-6.125672536213338, 106.77708905056554],
  [-6.122799111971326, 106.77545971404832],
  [-6.12173766524876, 106.77348611887129],
  [-6.121816466201741, 106.7714238030757],
  [-6.122166292658145, 106.76794691050635],
  [-6.122572722706937, 106.76418935240662],
  [-6.118923067711559, 106.73626838430236],
  [-6.116949537447419, 106.73339305630363],
  [-6.1172909053656, 106.73299608937842],
  [-6.117536263422155, 106.73296390287098],
  [-6.117738950427408, 106.73361836185576],
  [-6.116208044996727, 106.73475319731853],
  [-6.111707651391373, 106.73739929079514],
  [-6.108894191325865, 106.73897228895173],
  [-6.109412461396495, 106.73943767302174],
  [-6.110051043472063, 106.74048013333852],
];

// icon mobil
const carIcon = L.icon({
  iconUrl: "/icons/purple_car.svg",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// phase untuk current location
const PHASE_COUNT = 5;
const PHASE_DURATION = 5000;
const TOTAL_DURATION = PHASE_COUNT * PHASE_DURATION;
const ARRIVED_AFTER_MS = 35000; // 35 detik

const PHASE_LOCATIONS = [
  "Head Office",
  "Menuju Tol Dalam Kota",
  "Tol Dalam Kota",
  "Pintu Keluar Tol PIK",
  "PIK Avenue",
];

function FitRouteBounds() {
  const map = useMap();
  React.useEffect(() => {
    const bounds = L.latLngBounds(route as any);
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [map]);
  return null;
}

type Props = {
  showTrip: boolean;
  status: TripStatus;
  onStatusChange?: (status: TripStatus) => void;
};

export default function InternalTransportMapInner({
  showTrip,
  status,
  onStatusChange,
}: Props) {
  const mapRef = React.useRef<L.Map | null>(null);
  const markerRef = React.useRef<L.Marker | null>(null);

  // logger klik (optional)
  React.useEffect(() => {
    if (!mapRef.current) return;

    const handler = (e: L.LeafletMouseEvent) => {
      console.log(`[${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}],`);
    };

    mapRef.current.on("click", handler);

    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", handler);
      }
    };
  }, []);

  // drag card
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const [cardPos, setCardPos] = React.useState({ x: 0, y: 24 });
  const dragState = React.useRef({
    dragging: false,
    offsetX: 0,
    offsetY: 0,
  });

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [phase, setPhase] = React.useState(0);

  // ====== TIMER 35 DETIK → ARRIVED ======
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!showTrip) return;
    if (status === "Arrived") return;

    const id = window.setTimeout(() => {
      onStatusChange?.("Arrived");
    }, ARRIVED_AFTER_MS);

    return () => window.clearTimeout(id);
  }, [showTrip, status, onStatusChange]);

  // ====== ANIMASI MOBIL + PHASE ======
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId: number;
    const startTime = performance.now();

    const animate = () => {
      if (!markerRef.current || !showTrip) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      const now = performance.now();
      const elapsed = (now - startTime) % TOTAL_DURATION;

      let progress: number;
      let phaseIndex: number;

      if (status === "Arrived") {
        // kunci di titik terakhir
        progress = 1;
        phaseIndex = PHASE_COUNT - 1;
      } else {
        progress = elapsed / TOTAL_DURATION;
        phaseIndex = Math.floor(elapsed / PHASE_DURATION);
      }

      const index = Math.floor(progress * (route.length - 1));
      markerRef.current.setLatLng(route[index] as any);

      setPhase((prev) => (prev !== phaseIndex ? phaseIndex : prev));

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [showTrip, status]);

  // ====== DRAG CARD ======
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current || !mapRef.current) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const containerRect = mapRef.current.getContainer().getBoundingClientRect();

    dragState.current.dragging = true;
    dragState.current.offsetX = e.clientX - cardRect.left;
    dragState.current.offsetY = e.clientY - cardRect.top;

    setCardPos({
      x: cardRect.left - containerRect.left,
      y: cardRect.top - containerRect.top,
    });

    cardRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging || !mapRef.current) return;

    const containerRect = mapRef.current.getContainer().getBoundingClientRect();

    const nextX = e.clientX - containerRect.left - dragState.current.offsetX;
    const nextY = e.clientY - containerRect.top - dragState.current.offsetY;

    setCardPos({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragState.current.dragging = false;
    cardRef.current?.releasePointerCapture(e.pointerId);
  };

  const isArrived = status === "Arrived";

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-2xl">
      {/* MAP */}
      <MapContainer
        center={route[0] as LatLngExpression}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, HERE, Garmin, FAO, NOAA, USGS, & others"
        />

        {showTrip && (
          <>
            <Polyline
              positions={route}
              pathOptions={{ color: "#4F46E5", weight: 5 }}
            />

            <Marker
              position={route[0]}
              icon={carIcon}
              ref={(marker) => {
                if (marker) markerRef.current = marker;
              }}
            />

            <FitRouteBounds />
          </>
        )}
      </MapContainer>

      {/* INFO CARD – hanya muncul kalau showTrip = true */}
      {showTrip && (
        <div
          ref={cardRef}
          className="absolute z-[500] w-[360px] max-w-[95%] cursor-move select-none rounded-2xl bg-white/95 px-4 py-3 text-[11px] shadow-[0_18px_40px_rgba(15,23,42,0.25)] backdrop-blur-sm md:w-[380px] md:text-[12px]"
          style={{
            left: cardPos.x === 0 ? "50%" : `${cardPos.x}px`,
            top: `${cardPos.y}px`,
            transform: cardPos.x === 0 ? "translateX(-50%)" : "none",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                i
              </div>
              <div className="text-[12px] font-semibold tracking-wide text-slate-800">
                Information
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  isArrived
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isArrived ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {isArrived ? "Arrived" : "On Trip"}
              </span>
              <button
                className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] text-slate-500 hover:bg-slate-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed((prev) => !prev);
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {isCollapsed ? "▾" : "▴"}
              </button>
            </div>
          </div>

          {!isCollapsed && (
            <>
              <div className="mt-2 flex items-start justify-between gap-3">
                <div>
                  <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-0.5">
                    <span className="font-semibold text-slate-500">
                      Vehicle ID
                    </span>
                    <span className="text-slate-800">: CAR-02</span>

                    <span className="font-semibold text-slate-500">Driver</span>
                    <span className="text-slate-800">: Budi Santoso</span>

                    <span className="font-semibold text-slate-500">
                      Start From
                    </span>
                    <span className="text-slate-800">: HO</span>

                    <span className="font-semibold text-slate-500">
                      Departure
                    </span>
                    <span className="text-slate-800">: 11.40 WIB</span>

                    <span className="font-semibold text-slate-500">
                      Destination
                    </span>
                    <span className="text-slate-800">: PIK Avenue</span>

                    <span className="font-semibold text-slate-500">ETA</span>
                    <span className="text-slate-800">: 12.45 WIB</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 text-right text-[11px] text-slate-600">
                  <div>
                    <span className="font-semibold">Current Location :</span>
                    <br />
                    <span>{PHASE_LOCATIONS[phase]}</span>
                  </div>
                  <div className="mt-0.5">
                    <span className="font-semibold">Alert :</span>{" "}
                    <span>-</span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    Last Update :{" "}
                    <span className="font-semibold text-slate-700">11.38</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
