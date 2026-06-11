'use client';
import { Card, CardContent } from "@/components/ui/card";
import { useGetParcelByIdQuery } from "@/features/parcel/parcelApi";
import { useSelector } from "react-redux";
import { selectCurrency } from "@/features/currency/currencySlice";
import { formatCurrency } from "@/utils/formatCurrency";
import DeliveryMap from "./DeliveryMap";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Box,
  Calendar,
  Clock,
  FileText,
  Mail,
  Map as MapIcon,
  Package,
  Phone,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";

interface OrderDetailsProps {
  id: string;
}

export default function OrderDetails({ id }: OrderDetailsProps) {
  const { data: response, isLoading } = useGetParcelByIdQuery(id);
  const parcel = response?.data;
  const currency = useSelector(selectCurrency);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF4A00]" />
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Parcel not found</p>
        <Link href="/order-management" className="text-[#FF4A00] mt-4 inline-block font-medium hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const stats = [
    {
      label: "Date & Time",
      value: new Date(parcel.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      sub: new Date(parcel.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      icon: Calendar,
      color: "text-red-400"
    },
    {
      label: "Parcel Type",
      value: parcel.name,
      sub: parcel.vehicleType.toUpperCase(),
      icon: Box,
      color: "text-red-400"
    },
    {
      label: "Distance",
      value: `${parcel.distance.toFixed(1)} km`,
      sub: "Delivery Route",
      icon: MapIcon,
      color: "text-red-400"
    },
    {
      label: "Duration",
      value: parcel.duration,
      sub: "Estimated Time",
      icon: Clock,
      color: "text-red-400"
    },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-10">
      {/* ── Breadcrumbs / Header ── */}
      <div className="space-y-6">
        <Link
          href="/order-management"
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-medium">History Details</h1>
          <p className="text-gray-400 font-normal text-base">Order ID: <span className="text-[#FF4A00] font-semibold">#{parcel._id.toUpperCase()}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 mt-4">

        {/* ── Left Column (Route & Info) ── */}
        <div className="col-span-12 lg:col-span-8 space-y-8">

          {/* Delivery Route Card */}
          <Card className="border-none shadow-none bg-[#FFFAF5] rounded-lg overflow-hidden p-2">
            <CardContent className="p-4 space-y-10">
              <p className="text-base font-medium text-gray-400">Delivery Route</p>

              <div className="relative pl-8 space-y-12">
                {/* Connector Line */}
                <div className="absolute left-[3.5px] top-6 bottom-6 w-0.5 bg-gray-200" />

                <div className="relative">
                  <div className="absolute -left-8 top-1.5 w-2 h-2 rounded-full bg-red-400 ring-4 ring-red-400/10" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#2C2E33]">Pickup</p>
                    <p className="text-sm font-medium text-gray-500">{parcel.pickupLocation.address}</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-8 top-1.5 w-2 h-2 rounded-full bg-[#1A365D]" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#2C2E33]">Dropoff</p>
                    <p className="text-sm font-medium text-gray-500">{parcel.dropLocation.address}</p>
                  </div>
                </div>
              </div>

              {/* Leaflet Map — Pickup (red) + Dropoff (dark blue) with route */}
              <div className="w-full aspect-[21/9] bg-gray-100 rounded-3xl overflow-hidden relative border border-white shadow-inner">
                <DeliveryMap
                  pickupLat={parcel.pickupLocation.coordinates[1]}
                  pickupLng={parcel.pickupLocation.coordinates[0]}
                  dropLat={parcel.dropLocation.coordinates[1]}
                  dropLng={parcel.dropLocation.coordinates[0]}
                  pickupAddress={parcel.pickupLocation.address}
                  dropAddress={parcel.dropLocation.address}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bottom Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Card key={i} className="border-none shadow-none bg-white rounded-lg p-6">
                <CardContent className="p-0 space-y-6">
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                  <div className="space-y-1">
                    <p className="text-sm font-normal text-gray-400">{stat.label}</p>
                    <p className="text-sm font-medium text-[#2C2E33] leading-none">{stat.value}</p>
                    <p className="text-xs font-normal text-gray-500">{stat.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Note Card */}
          <Card className="border-[1.5px] shadow-none border-dashed border-gray-300 bg-[#DCE4E84D] rounded-2xl p-8">
            <CardContent className="p-0 flex items-center gap-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 shrink-0">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#2C2E33]">Note</p>
                <p className="text-sm font-medium text-gray-500">
                  {parcel.note || "No additional notes provided for this delivery."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column (Info Sides) ── */}
        <div className="col-span-12 lg:col-span-4 space-y-8">

          {/* Driver Information Card */}
          <Card className="border-none shadow-none bg-white rounded-xl overflow-hidden p-2">
            <CardContent className="p-4 space-y-6">
              <p className="text-sm font-medium text-[#2C2E33]">Driver Information</p>
              {parcel.driver ? (
                <div className="flex items-center gap-4 pt-2">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100/50 shrink-0">
                    {parcel.driver.image ? (
                      <img src={parcel.driver.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1A365D] flex items-center justify-center text-white font-medium text-xl">
                        {parcel.driver.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-base font-medium text-[#2C2E33] truncate">{parcel.driver.fullName}</p>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                      <span className="text-xs font-medium text-red-400">
                        {parcel.driver.averageRating || 0} Rating
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-400 truncate">{parcel.driver.phone}</p>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
                  <p className="text-sm font-medium text-gray-400">No driver assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sender Info Card */}
          <Card className="border-none shadow-none bg-[#FFFAF5] rounded-xl p-6">
            <CardContent className="p-0 space-y-6">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <Package className="w-4 h-4 text-[#FF4A00]" />
                </div>
                <p className="text-base font-medium text-[#2C2E33]">Sender Info</p>
              </div>
              <div className="space-y-4">
                <p className="text-lg font-medium text-[#2C2E33]">{parcel.sender.fullName}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <Mail className="w-4 h-4 opacity-40 shrink-0" />
                    {parcel.sender.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <Phone className="w-4 h-4 opacity-40 shrink-0" />
                    {parcel.sender.phone}
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-400 leading-relaxed">
                  {parcel.sender.address || parcel.pickupLocation.address}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Receiver Info Card */}
          <Card className="border-none shadow-none bg-[#FFFAF5] rounded-xl p-6">
            <CardContent className="p-0 space-y-6">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <User className="w-4 h-4 text-[#FF4A00]" />
                </div>
                <p className="text-base font-medium text-[#2C2E33]">Receiver Info</p>
              </div>
              <div className="space-y-4">
                <p className="text-lg font-medium text-[#2C2E33]">{parcel.receiverName}</p>
                <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                  <Phone className="w-4 h-4 opacity-40 shrink-0" />
                  {parcel.receiverPhone}
                </div>
                <p className="text-xs font-medium text-gray-400 leading-relaxed">
                  {parcel.dropLocation.address}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown Card */}
          <Card className="border-none shadow-none bg-white rounded-xl p-6 overflow-hidden relative shadow-sm border border-gray-100">
            <CardContent className="p-0 space-y-8">
              <p className="text-base font-medium text-[#2C2E33]">Price Breakdown</p>

              <div className="space-y-4">



                <div className="flex justify-between text-base font-medium text-gray-500">
                  <span>Distance</span>
                  <span>{formatCurrency(parcel.distance, currency)}</span>
                </div>

                <div className="flex justify-between text-base font-medium text-gray-500">
                  <span>Cost Per distance</span>
                  <span>{formatCurrency(parcel.perKiloCost, currency)}+{parcel.distance.toFixed(2)}km = {formatCurrency(parcel.perKiloCost * parcel.distance, currency)}</span>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-500">
                  <span>Base fare</span>
                  <span>{formatCurrency(parcel.baseFare, currency)}</span>
                </div>
              </div>


              <div className="flex justify-between items-end pt-6 border-t border-gray-100">
                <span className="text-xl font-medium text-[#2C2E33]">Total Fee</span>
                <span className="text-3xl font-medium text-[#FF4A00]">{formatCurrency(parcel.totalDeliveryFee, currency)}</span>
              </div>

              <div className='space-y-2'>
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>DriverShare</span>
                  <span>{formatCurrency(parcel.driverShare, currency)}</span>
                </div>

                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Platform Commission</span>
                  <span>{formatCurrency(parcel.platformCommission, currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
