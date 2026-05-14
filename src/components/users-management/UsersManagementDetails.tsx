
"use client"

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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UsersManagementDetailsProps {
  id: string;
}

export default function UsersManagementDetails({ id }: UsersManagementDetailsProps) {
  const router = useRouter();
  const { data: response, isLoading } = useGetUserByIdQuery({ id });
  const [suspense] = useSuspenseMutation();
  const user = response?.data;

  const handleSuspense = async () => {
    try {
      await suspense({ id }).unwrap();
      toast.success("User account status updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils"; import LoadingSpin from "../LoadingSpin";

