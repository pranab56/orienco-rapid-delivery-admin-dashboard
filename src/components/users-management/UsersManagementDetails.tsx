
"use client"

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import LoadingSpin from "../LoadingSpin";

import {
  ArrowLeft,
  Mail,
  MapPin,
  User,
  Calendar,
  Clock,
  Star,
  Wallet,
  CheckCircle2,
  XCircle,
  Phone,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useGetUserByIdQuery, useSuspenseMutation } from "@/features/user/userApi";
import { useGetAllVehicleQuery, useRemoveDriverMutation } from "@/features/vehicle/vehicleApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UsersManagementDetailsProps {
  id: string;
}

export default function UsersManagementDetails({ id }: UsersManagementDetailsProps) {
  const router = useRouter();
  const { data: response, isLoading } = useGetUserByIdQuery({ id });
  const [suspense] = useSuspenseMutation();
  const { data: vehicleData } = useGetAllVehicleQuery({ page: 1 });
  const [removeDriver] = useRemoveDriverMutation();
  const user = response?.data;

  const vehicles = vehicleData?.data?.vehicles || [];
  const assignedVehicleId = user?.driverInfo?.assignedVehicle;
  const assignedVehicle = vehicles.find((v: any) => v._id === assignedVehicleId);

  const handleRemoveVehicle = async () => {
    if (!assignedVehicleId) return;
    try {
      const resp = await removeDriver({ driverId: user._id, vehicleId: assignedVehicleId }).unwrap();
      toast.success(resp?.message || "Vehicle removed successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove vehicle");
    }
  };

  const handleSuspense = async () => {
    try {
      await suspense({ id }).unwrap();
      toast.success("User account status updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !user || !user.location || user.role !== "driver") return;
    
    let isMounted = true;
    const loadGoogleMaps = () => {
      if ((window as any).google) {
        initMap();
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDwBdLOatYV5UMXO-zGDQMj2R1ErlK8Pqs`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (isMounted) initMap();
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      const mapContainer = document.getElementById("google-map-container");
      if (!mapContainer || !(window as any).google || !isMounted) return;

      const g = (window as any).google;
      const [lng, lat] = user.location && user.location.length >= 2 ? user.location : [90.4152367, 23.8040917];
      const position = { lat, lng };

      const map = new g.maps.Map(mapContainer, {
        center: position,
        zoom: 14,
        disableDefaultUI: true,
        styles: [
          {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#7c7c7c" }]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{ "visibility": "on" }, { "color": "#e6e6e6" }]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{ "color": "#f5f5f5" }]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{ "color": "#f5f5f5" }]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#ffffff" }]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#e9e9e9" }]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#e0ecf8" }]
          }
        ]
      });

      new g.maps.Marker({
        position,
        map,
        title: "Live Location",
        icon: {
          url: "data:image/svg+xml;utf-8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="17" fill="#0047FF" stroke="#FFFFFF" stroke-width="3" />
              <g transform="translate(11, 11)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </g>
            </svg>
          `),
          scaledSize: new g.maps.Size(42, 42),
          origin: new g.maps.Point(0, 0),
          anchor: new g.maps.Point(21, 21),
        }
      });

      const zoomInBtn = document.getElementById("map-zoom-in");
      const zoomOutBtn = document.getElementById("map-zoom-out");

      if (zoomInBtn) {
        zoomInBtn.onclick = () => map.setZoom(map.getZoom() + 1);
      }
      if (zoomOutBtn) {
        zoomOutBtn.onclick = () => map.setZoom(map.getZoom() - 1);
      }
    };

    loadGoogleMaps();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpin />
      </div>
    );
  }

  if (!user) return <div className="text-center py-10">User not found</div>;

  const isDriver = user.role === "driver";

  return (
    <div className="space-y-8 pb-10">
      {/* ── Breadcrumbs / Action ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Users
        </button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className={cn(
              "w-full sm:w-auto px-6 sm:px-10 py-2.5 border rounded-sm cursor-pointer text-xs sm:text-sm font-medium shadow-sm transition-all active:scale-95",
              user.status === "active"
                ? "bg-white border-red-100 text-red-400 hover:bg-red-50"
                : "bg-white border-green-100 text-green-400 hover:bg-green-50"
            )}>
              {user.status === "active" ? "Suspend Account" : "Activate Account"}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white rounded-xl border-none shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-[#2C2E33]">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 font-medium">
                This action will {user.status === "active" ? "temporarily suspend" : "reactivate"} {user.fullName}&apos;s account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel className="bg-gray-100 border-none rounded-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSuspense}
                className="bg-[#FF4A00] text-white rounded-sm font-medium hover:bg-[#e64300] transition-colors"
              >
                Yes, {user.status === "active" ? "Suspend" : "Activate"} Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-medium">View User Details</h1>
        <p className="text-sm sm:text-base text-gray-500 font-normal">Complete information about this user account.</p>
      </div>

      <div className="grid grid-cols-12 gap-8 mt-10">

        {/* ── Profile Sidebar ── */}
        <div className="col-span-12 lg:col-span-4 h-fit">
          <Card className="border-none rounded-lg overflow-hidden p-1 sm:p-2">
            <CardContent className="p-5 sm:p-10 flex flex-col items-center text-center">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-xl overflow-hidden mb-6 bg-gray-100">
                {user.image ? (
                  <Image src={user.image} alt={user.fullName} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#1A365D] text-3xl sm:text-4xl font-black uppercase">
                    {user.fullName.charAt(0)}
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-8">
                <h2 className="text-2xl font-medium">{user.fullName}</h2>
                <p className="text-sm font-medium text-gray-400">#{user._id.slice(-8).toUpperCase()}</p>
                <div className={cn(
                  "inline-block px-4 py-1 text-[10px] font-medium rounded-full uppercase tracking-wider",
                  isDriver ? "bg-[#FFF4E6] text-[#FF4A00]" : "bg-[#E6F9FF] text-[#33B4EA]"
                )}>
                  {user.role}
                </div>
              </div>

              <div className="w-full space-y-6 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 border border-gray-50 rounded-lg">
                    {user.status === "active" ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Status</p>
                    <p className="text-sm font-medium text-gray-700 capitalize">{user.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 border border-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Joined</p>
                    <p className="text-sm font-medium text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {isDriver && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center shrink-0 border border-gray-50 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Rating</p>
                        <p className="text-sm font-medium text-gray-700">{user.driverInfo?.averageRating.toFixed(1)} / 5.0</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center shrink-0 border border-gray-50 rounded-lg">
                        <Wallet className="w-5 h-5 text-green-500" />
                      </div>
                      {
                        user?.driverInfo?.totalEarnings ? (
                          <div className="text-left">
                            <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Total Earnings</p>
                            <p className="text-sm font-medium text-gray-700">${user?.driverInfo?.totalEarnings}</p>
                          </div>
                        ) : (
                          <div className="text-left">
                            <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Total Earnings</p>
                            <p className="text-sm font-medium text-gray-700">$0.00</p>
                          </div>
                        )
                      }
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Main Information ── */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="border-none shadow-sm rounded-lg overflow-hidden">
            <CardContent className="p-5 sm:p-10 space-y-8 sm:space-y-12">
              <h3 className="text-lg sm:text-xl font-medium">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest leading-none">Full Name</p>
                    <p className="text-base font-medium text-gray-700 leading-tight">{user.fullName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest leading-none">Email</p>
                    <p className="text-base font-medium text-gray-700 leading-tight">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest leading-none">Phone</p>
                    <p className="text-base font-medium text-gray-700 leading-tight">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 col-span-1 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest leading-none">Address</p>
                    <p className="text-base font-medium text-gray-700 leading-6 max-w-xl">
                      {user.address || "No address provided"}
                    </p>
                  </div>
                </div>
              </div>

              {isDriver && (
                <>
                  <div className="pt-8 border-t border-gray-100">
                  <h3 className="text-lg sm:text-xl font-medium mb-8">Verification Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">NID Card</p>
                      <div className="grid grid-cols-2 gap-4">
                        {user.driverInfo?.nid?.length > 0 ? user.driverInfo.nid.map((img: string, i: number) => (
                          <Dialog key={i}>
                            <DialogTrigger asChild>
                              <div className="aspect-[3/2] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative group cursor-pointer hover:shadow-md transition-shadow">
                                <Image src={img} alt={`NID ${i}`} fill className="object-cover transition-transform group-hover:scale-110" unoptimized />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <div className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    Click to view
                                  </div>
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl border-none p-0 bg-transparent shadow-none">
                              <DialogTitle className="sr-only">NID Image</DialogTitle>
                              <div className="relative w-full h-[80vh] bg-black/20 rounded-2xl overflow-hidden backdrop-blur-sm">
                                <Image src={img} alt={`NID ${i}`} fill className="object-contain" unoptimized />
                              </div>
                            </DialogContent>
                          </Dialog>
                        )) : (
                          <div className="col-span-2 py-8 text-center text-sm text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            No NID documents uploaded
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Driving License</p>
                      <div className="grid grid-cols-2 gap-4">
                        {user.driverInfo?.drivingLicense?.length > 0 ? user.driverInfo.drivingLicense.map((img: string, i: number) => (
                          <Dialog key={i}>
                            <DialogTrigger asChild>
                              <div className="aspect-[3/2] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative group cursor-pointer hover:shadow-md transition-shadow">
                                <Image src={img} alt={`License ${i}`} fill className="object-cover transition-transform group-hover:scale-110" unoptimized />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <div className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    Click to view
                                  </div>
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl border-none p-0 bg-transparent shadow-none">
                              <DialogTitle className="sr-only">Driving License Image</DialogTitle>
                              <div className="relative w-full h-[80vh] bg-black/20 rounded-2xl overflow-hidden backdrop-blur-sm">
                                <Image src={img} alt={`License ${i}`} fill className="object-contain" unoptimized />
                              </div>
                            </DialogContent>
                          </Dialog>
                        )) : (
                          <div className="col-span-2 py-8 text-center text-sm text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            No license documents uploaded
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {isDriver && (
        <div className="grid grid-cols-12 gap-8 mt-8">
          {/* Live Vehicle Location */}
          <div className="col-span-12 lg:col-span-8">
            <Card className="border-none shadow-sm rounded-lg overflow-hidden h-[450px] relative flex flex-col bg-white">
              <div className="p-5 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="text-lg sm:text-xl font-medium text-[#2C2E33]">Live Vehicle Location</h3>
              </div>
              <div className="flex-1 relative bg-gray-50">
                <div id="google-map-container" className="w-full h-full min-h-[300px]" />
                
                {/* Custom Map Controls */}
                <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
                  <button id="map-zoom-in" className="w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-md flex items-center justify-center font-bold text-lg text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer">
                    +
                  </button>
                  <button id="map-zoom-out" className="w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-md flex items-center justify-center font-bold text-lg text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer">
                    -
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Assigned Vehicle */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="border-none shadow-sm rounded-lg overflow-hidden h-[450px] flex flex-col bg-white">
              <div className="p-5 sm:p-6 border-b border-gray-100 bg-white">
                <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">ASSIGNED VEHICLE</p>
              </div>
              
              <div className="flex-1 p-6 flex flex-col justify-between">
                {assignedVehicleId ? (
                  <>
                    <div className="space-y-6">
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                        {assignedVehicle?.image ? (
                          <Image src={assignedVehicle.image} alt={assignedVehicle.name} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full bg-[#1A365D] flex items-center justify-center text-white text-3xl font-bold uppercase">
                            {assignedVehicle?.type?.charAt(0) || "V"}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold text-[#2C2E33]">{assignedVehicle?.name || "Unknown Vehicle"}</h4>
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                          <span>#</span>
                          <span>{assignedVehicle?.licensePlate || user.driverInfo?.assignedVehiclePlate || "No Plate"}</span>
                        </div>
                        <div className="pt-2">
                          <span className="px-4 py-1.5 bg-orange-50 text-[#FF4A00] text-xs font-bold rounded-sm uppercase tracking-wider">
                            {assignedVehicle?.type || "Unknown Type"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="w-full py-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer text-sm font-medium shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove Vehicle
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white rounded-xl border-none shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-bold text-[#2C2E33]">Remove Assigned Vehicle?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-500 font-medium font-normal">
                            Are you sure you want to remove the assigned vehicle ({assignedVehicle?.name || "Unknown Vehicle"}) from {user.fullName}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6">
                          <AlertDialogCancel className="bg-gray-100 border-none rounded-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleRemoveVehicle}
                            className="bg-[#FF0000] text-white rounded-sm font-medium hover:bg-red-600 transition-colors"
                          >
                            Yes, Remove Vehicle
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.321-5.128a2.25 2.25 0 0 0-2.242-2.108H3.375m16.5 4.5V12m0 0V9m0 0a2.25 2.25 0 0 0-2.25-2.25h-1.35m-7.5 0h7.5m-7.5 0H3.375m0 0A2.25 2.25 0 0 0 1.125 9v5.25m0 0a2.25 2.25 0 0 0 2.25 2.25h1.35m-1.35 0h12" />
                      </svg>
                    </div>
                    <p className="text-gray-400 font-medium text-sm">No vehicle assigned to this driver.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
