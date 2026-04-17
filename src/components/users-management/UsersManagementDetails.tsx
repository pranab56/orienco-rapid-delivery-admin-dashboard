"use client";

import {
  ArrowLeft,
  Mail,
  MapPin,
  User,
  Calendar,
  Clock,
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
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";


interface UsersManagementDetailsProps {
  id: string;
}

export default function UsersManagementDetails({}: UsersManagementDetailsProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-10">
      {/* ── Breadcrumbs / Action ── */}
      <div className="flex justify-between items-start">
        <Link
          href="/users-management"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Users
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="px-10 py-2.5 bg-white border border-red-100 text-red-400 rounded-sm cursor-pointer text-sm font-medium shadow-sm hover:bg-red-50 transition-all active:scale-95">
              Suspend Account
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white rounded-xl border-none shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-[#2C2E33]">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 font-medium">
                This action will temporarily suspend John Smith&apos;s account. They will not be able to log in or use the platform until the suspension is lifted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel className="bg-gray-100 border-none rounded-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction className="bg-[#FF4A00] text-white rounded-sm font-medium hover:bg-[#e64300] transition-colors">
                Yes, Suspend Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-medium ">View User Details</h1>
        <p className="text-gray-500 font-normal">Complete information about this user account.</p>
      </div>

      <div className="grid grid-cols-12 gap-8 mt-10">

        {/* ── Profile Sidebar ── */}
        <div className="col-span-12 lg:col-span-4 h-fit">
          <Card className="border-none rounded-lg overflow-hidden p-2">
            <CardContent className="p-10 flex flex-col items-center text-center">
              <div className="relative w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden mb-6">
                <div className="w-full h-full bg-[#1A365D] flex items-center justify-center text-white text-4xl font-black">
                  JS
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <h2 className="text-2xl font-medium">John Smith</h2>
                <p className="text-sm font-medium text-gray-400">#USR-00124</p>
                <div className="inline-block px-4 py-1 bg-[#E6F9FF] text-[#33B4EA] text-[10px] font-medium rounded-full uppercase tracking-wider">
                  User
                </div>
              </div>

              <div className="w-full space-y-6 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 border border-gray-50">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-400 tracking-widest">Role</p>
                    <p className="text-sm font-medium text-gray-700">User</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 border border-gray-50">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-400 tracking-widest">Joined</p>
                    <p className="text-sm font-medium text-gray-700">Jan 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 border border-gray-50">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-400 tracking-widest">Last Active</p>
                    <p className="text-sm font-medium text-gray-700">2 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Main Information ── */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="border-none shadow-sm rounded-lg overflow-hidden">
            <CardContent className="p-10 space-y-12">
              <h3 className="text-xl font-medium">Personal Information</h3>

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 shrink-0 border-2 border-white shadow-sm ring-1 ring-gray-100">
                  <div className="w-full h-full bg-[#1A365D]" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Profile Picture</p>
                  <p className="text-sm text-gray-400">User&apos;s profile image</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest leading-none">Full Name</p>
                    <p className="text-base font-medium text-gray-700 leading-tight">John Smith</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest leading-none">Email</p>
                    <p className="text-base font-medium text-gray-700 leading-tight">john.smith@email.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 col-span-1 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest leading-none">Address</p>
                    <p className="text-base font-medium text-gray-700 leading-6 max-w-xl">
                      123 Main Street, Downtown District, Valley Region, CA 94102
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Document Section ── */}
      <h3 className="text-xl font-medium pt-10">National ID Card</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="col-span-2 aspect-[3/2] bg-gray-100 rounded-[32px] overflow-hidden border-4 border-white shadow-sm flex items-center justify-center p-4">
          <div className="w-full h-full bg-[#D9D9D9] rounded-2xl flex items-center justify-center text-gray-400 text-xs font-bold">
            [ National ID Front ]
          </div>
        </div>
        <div className="col-span-2 aspect-[3/2] bg-gray-100 rounded-[32px] overflow-hidden border-4 border-white shadow-sm flex items-center justify-center p-4">
          <div className="w-full h-full bg-[#D9D9D9] rounded-2xl flex items-center justify-center text-gray-400 text-xs font-bold">
            [ Driving License ]
          </div>
        </div>
      </div>
    </div>
  );
}
