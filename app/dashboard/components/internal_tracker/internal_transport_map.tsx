// app/dashboard/components/internal_tracker/internal_transport_map.tsx
"use client";

import dynamic from "next/dynamic";
import type { TripStatus } from "./internal_transport_map_inner";

const InternalTransportMapInner = dynamic(
  () => import("./internal_transport_map_inner"),
  { ssr: false }
);

type Props = {
  showTrip: boolean;
  status: TripStatus;
  onStatusChange?: (status: TripStatus) => void;
};

export default function InternalTransportMap(props: Props) {
  return <InternalTransportMapInner {...props} />;
}
