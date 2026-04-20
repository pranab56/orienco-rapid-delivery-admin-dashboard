"use client";

import {
  ArrowLeft,
  ChevronRight,
  Mail,
  MapPin,
  User,
  Calendar,
  Clock,
  Maximize2,
  Plus,
  Minus,
  Bike
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface DriverDetailsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  driver: any;
  onBack: () => void;
}

export default function DriverDetails({ driver, onBack }: DriverDetailsProps) {
  if (!driver) return null;

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-10">
      {/* ── Breadcrumbs ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <span className="text-sm font-medium text-gray-400 cursor-pointer hover:text-gray-600" onClick={onBack}>Manage Driver</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-semibold text-[#2C2E33]">{driver.name}</span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-medium">View User Details</h1>
        <p className="text-sm sm:text-base text-[#737780] font-normal">Complete information about this user account.</p>
      </div>

      <div className="space-y-10">

        {/* ── Left Sidebar: Profile Card ── */}
        <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-10">
          <Card className="border-none shadow-sm bg-white rounded-xl p-1 sm:p-2 overflow-hidden w-full lg:w-4/12">
            <CardContent className="px-6 sm:px-10 py-5 sm:py-8 flex flex-col items-center text-center">
              <div className="relative w-28 h-28 sm:w-30 sm:h-30 rounded-full border-4 border-white shadow-xl overflow-hidden mb-6">
                <Image src={"https://i.pravatar.cc/300"} alt={driver.name ?? "Driver"} fill className="object-cover" unoptimized />
              </div>

              <div className="space-y-2 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-medium">{driver.name}</h2>
                <p className="text-sm font-medium text-gray-400">#USR-00124</p>
                <div className="inline-block px-4 py-1.5 bg-[#FDE6D2] text-[#FF4A00] text-[10px] font-normal rounded-full uppercase tracking-wider">
                  Driver
                </div>
              </div>

              <div className="w-full space-y-6 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-normal text-gray-400">Role</p>
                    <p className="text-base font-medium text-gray-700">User</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-normal text-gray-400">Joined</p>
                    <p className="text-base font-medium text-gray-700">Jan 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-normal text-gray-400">Last Active</p>
                    <p className="text-base font-medium text-gray-700">2 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-xl p-1 sm:p-2 overflow-hidden w-full lg:flex-1">
            <CardContent className="p-5 sm:p-10 space-y-8 sm:space-y-10">
              <h3 className="text-lg sm:text-xl font-bold text-[#2C2E33]">Personal Information</h3>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 shrink-0 border-2 border-white shadow-sm">
                  <Image src={"https://i.pravatar.cc/300"} alt={driver.name ?? "Driver"} className="object-cover" width={1000} height={1000} />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-[#2C2E33]">Profile Picture</p>
                  <p className="text-sm text-gray-400">User&apos;s profile image</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400 leading-none">Full Name</p>
                    <p className="text-base font-medium text-gray-700 leading-tight">{driver.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400 leading-none">Email</p>
                    <p className="text-base font-medium text-gray-700 leading-tight">john.smith@email.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400 leading-none">Address</p>
                    <p className="text-base font-medium text-gray-700 leading-tight">123 Main Street, Downtown District, Valley Region, CA 94102</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Main Content: Personal & IDs ── */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          {/* Documents Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <h4 className="text-sm sm:text-base font-medium text-[#2C2E33]">National ID Card</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/2] bg-white rounded-2xl overflow-hidden relative border border-white shadow-sm">
                  <Image src={"https://i.pravatar.cc/290"} alt={driver.name ?? "Driver"} className="object-cover" width={1000} height={1000} />
                </div>
                <div className="aspect-[3/2] bg-white rounded-2xl overflow-hidden relative border border-white shadow-sm">
                  <Image src={"https://i.pravatar.cc/292"} alt={driver.name ?? "Driver"} className="object-cover" width={1000} height={1000} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-base font-medium text-[#2C2E33]">Driving License</h4>
              <div className="aspect-[16/11] bg-white rounded-2xl overflow-hidden relative border border-white shadow-sm max-w-[400px]">
                <Image src={"https://i.pravatar.cc/294"} alt={driver.name ?? "Driver"} className="object-cover" width={1000} height={1000} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Map & Vehicle Sections ── */}
      <div className="grid grid-cols-12 gap-8 mt-10">
        {/* Map */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden h-full min-h-[400px] sm:min-h-[500px] flex flex-col p-0">
            <CardContent className="p-5 sm:p-8 flex-1 flex flex-col gap-4 sm:gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold text-[#2C2E33]">Live Vehicle Location</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Real-time Signal</span>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Maximize2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex-1 relative rounded-xl overflow-hidden bg-[#D9D9D9]">
                {/* Fake Map Grid Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

                {/* Zoom Controls */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  <button className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Plus className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Minus className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Vehicle Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-[#0066CC] rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
                    <Bike className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4500] rounded-full border-2 border-white shadow-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Vehicle Card */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden h-full p-0">
            <CardContent className="p-6 sm:p-8 space-y-6 sm:space-y-8">
              <h3 className="text-lg sm:text-xl font-medium text-[#2C2E33]">ASSIGNED VEHICLE</h3>

              <div className="space-y-4 sm:space-y-6">
                <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden relative shadow-sm">
                  <Image src={"https://i.pravatar.cc/288"} alt={driver.name ?? "Driver"} className="object-cover" width={10000} height={10000} />
                </div>

                <div className="space-y-3">
                  <div className="space-y-1 text-center">
                    <p className="text-lg sm:text-xl font-medium text-[#2C2E33] leading-none">{driver.vehicle}</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-400"># CA-904-XL-22</p>
                  </div>
                  <div className="w-full h-12 sm:h-14 bg-[#F2E4DF] flex items-center justify-center rounded-xl">
                    <span className="text-sm sm:text-base cursor-pointer font-medium text-[#FF4A00]">Van</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
