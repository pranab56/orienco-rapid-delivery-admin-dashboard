"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import {
  Bike,
  Car,
  Gauge,
  Percent,
  Route,
  Settings2,
  Truck,
} from "lucide-react";
import LoadingSpin from "@/components/LoadingSpin";
import {
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "@/features/setting/settingApi";

type VehicleType = "motorcycle" | "tricycle" | "van";

interface SettingForm {
  vehicleBaseFares: Record<VehicleType, string>;
  perKiloCost: string;
  platformCommissionPercentage: string;
}

const vehicleFields: {
  key: VehicleType;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "motorcycle", label: "Motorcycle Base Fare", icon: Bike },
  { key: "tricycle", label: "Tricycle Base Fare", icon: Truck },
  { key: "van", label: "Van Base Fare", icon: Car },
];

const emptyForm: SettingForm = {
  vehicleBaseFares: {
    motorcycle: "",
    tricycle: "",
    van: "",
  },
  perKiloCost: "",
  platformCommissionPercentage: "",
};

export default function SettingPage() {
  const { data: settingResponse, isLoading } = useGetSettingQuery(undefined);
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();

  console.log(settingResponse)

  const [formData, setFormData] = useState<SettingForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const settings = settingResponse?.data;
    if (!settings) return;

    setFormData({
      vehicleBaseFares: {
        motorcycle: String(settings.vehicleBaseFares?.motorcycle ?? ""),
        tricycle: String(settings.vehicleBaseFares?.tricycle ?? ""),
        van: String(settings.vehicleBaseFares?.van ?? ""),
      },
      perKiloCost: String(settings.perKiloCost ?? ""),
      platformCommissionPercentage: String(
        settings.platformCommissionPercentage ?? ""
      ),
    });
  }, [settingResponse]);

  const handleVehicleFareChange = (key: VehicleType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      vehicleBaseFares: {
        ...prev.vehicleBaseFares,
        [key]: value,
      },
    }));
    clearError(`vehicleBaseFares.${key}`);
  };

  const handleChange = (field: keyof Omit<SettingForm, "vehicleBaseFares">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const clearError = (field: string) => {
    if (!errors[field]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const parsePositiveNumber = (value: string, field: string, label: string) => {
    if (value.trim() === "") {
      return { error: `${label} is required` };
    }
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) {
      return { error: `${label} must be a valid number` };
    }
    return { value: num };
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    vehicleFields.forEach(({ key, label }) => {
      const result = parsePositiveNumber(
        formData.vehicleBaseFares[key],
        `vehicleBaseFares.${key}`,
        label
      );
      if (result.error) newErrors[`vehicleBaseFares.${key}`] = result.error;
    });

    const perKilo = parsePositiveNumber(
      formData.perKiloCost,
      "perKiloCost",
      "Per kilo cost"
    );
    if (perKilo.error) newErrors.perKiloCost = perKilo.error;

    const commission = parsePositiveNumber(
      formData.platformCommissionPercentage,
      "platformCommissionPercentage",
      "Platform commission"
    );
    if (commission.error) {
      newErrors.platformCommissionPercentage = commission.error;
    } else if (commission.value !== undefined && commission.value > 100) {
      newErrors.platformCommissionPercentage =
        "Platform commission cannot exceed 100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    try {
      await updateSetting({
        vehicleBaseFares: {
          motorcycle: Number(formData.vehicleBaseFares.motorcycle),
          tricycle: Number(formData.vehicleBaseFares.tricycle),
          van: Number(formData.vehicleBaseFares.van),
        },
        perKiloCost: Number(formData.perKiloCost),
        platformCommissionPercentage: Number(
          formData.platformCommissionPercentage
        ),
      }).unwrap();
      toast.success("Settings updated successfully");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <LoadingSpin />
      </div>
    );
  }

  return (
    <div className="container mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1 mb-8 sm:mb-10 pt-1 sm:pt-0">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2C2E33] flex items-center gap-3">
          <Settings2 className="w-7 h-7 text-[#FF4A00]" />
          Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-500 font-normal">
          Configure delivery fares, distance pricing, and platform commission.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <section className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-100 space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#2C2E33]">
              Vehicle Base Fares
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Starting fare for each vehicle type before distance charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {vehicleFields.map(({ key, label, icon: Icon }) => (
              <div key={key} className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">
                  {label}
                </Label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={formData.vehicleBaseFares[key]}
                    onChange={(e) => handleVehicleFareChange(key, e.target.value)}
                    placeholder="0"
                    className={`pl-11 sm:pl-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${
                      errors[`vehicleBaseFares.${key}`]
                        ? "border-red-500 ring-1 ring-red-500"
                        : "focus:ring-[#FF4A00]/20 focus:border-[#FF4A00]/30"
                    }`}
                  />
                </div>
                {errors[`vehicleBaseFares.${key}`] && (
                  <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">
                    {errors[`vehicleBaseFares.${key}`]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-100 space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#2C2E33]">
              Pricing & Commission
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Distance rate and platform fee applied to each delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">
                Per Kilo Cost
              </Label>
              <div className="relative">
                <Route className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.perKiloCost}
                  onChange={(e) => handleChange("perKiloCost", e.target.value)}
                  placeholder="0"
                  className={`pl-11 sm:pl-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${
                    errors.perKiloCost
                      ? "border-red-500 ring-1 ring-red-500"
                      : "focus:ring-[#FF4A00]/20 focus:border-[#FF4A00]/30"
                  }`}
                />
              </div>
              {errors.perKiloCost && (
                <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">
                  {errors.perKiloCost}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">
                Platform Commission (%)
              </Label>
              <div className="relative">
                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={formData.platformCommissionPercentage}
                  onChange={(e) =>
                    handleChange("platformCommissionPercentage", e.target.value)
                  }
                  placeholder="0"
                  className={`pl-11 sm:pl-12 pr-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${
                    errors.platformCommissionPercentage
                      ? "border-red-500 ring-1 ring-red-500"
                      : "focus:ring-[#FF4A00]/20 focus:border-[#FF4A00]/30"
                  }`}
                />
                <Gauge className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              {errors.platformCommissionPercentage && (
                <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">
                  {errors.platformCommissionPercentage}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="w-full sm:w-auto bg-[#FF4A00] hover:bg-[#E64200] text-white px-8 sm:px-10 h-11 sm:h-12 rounded-lg text-sm sm:text-base font-semibold shadow-lg shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
