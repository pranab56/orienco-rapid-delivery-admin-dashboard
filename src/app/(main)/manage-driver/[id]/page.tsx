"use client";

import { useRouter } from "next/navigation";
import DriverDetails from "@/components/manage-driver/DriverDetails";
import { use } from "react";

// ── Shared mock data (in a real app this would come from an API/store) ────────
const mockDrivers = [
  { id: "Emp #04928", name: "Marcus Thorne", vehicle: "Freightliner Cascadia", plate: "CA-904-XL-22", email: "marcus.thorne@orienco.com" },
  { id: "Emp #04112", name: "Sarah Jennings", vehicle: "Tesla Semi (Proto)", plate: "EV-441-TS-01", email: "sarah.j@orienco.com" },
  { id: "Emp #04391", name: "Leo Rodriguez", vehicle: "Peterbilt 579", plate: "TX-229-PB-09", email: "leo.r@orienco.com" },
  { id: "Emp #04882", name: "Elena Vance", vehicle: "No vehicle assigned", plate: null, email: "elena.v@orienco.com" },
  { id: "1", name: "Julian Dashwood", vehicle: "No vehicle assigned", plate: null, email: "julian.d@example.com" },
  { id: "2", name: "Maya West", vehicle: "No vehicle assigned", plate: null, email: "maya.w@webmail.com" },
  { id: "3", name: "Ryan Kholin", vehicle: "No vehicle assigned", plate: null, email: "r.kholin@logistics.co" },
];

export default function DriverDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  // Decode the id from the URL (it may be URL-encoded e.g. "Emp%20%2304928")
  const decodedId = decodeURIComponent(id);

  // Find the driver — fall back to a skeleton driver if not found
  const driver = mockDrivers.find(
    (d) => d.id === decodedId || d.id.replace("#", "").replace(" ", "") === decodedId
  ) ?? {
    id: decodedId,
    name: "Unknown Driver",
    vehicle: "N/A",
    plate: null,
    email: "N/A",
  };

  return (
    <DriverDetails
      driver={driver}
      onBack={() => router.push("/manage-driver")}
    />
  );
}