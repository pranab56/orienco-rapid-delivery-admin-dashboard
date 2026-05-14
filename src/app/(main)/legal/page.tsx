"use client";

import React, { useState, useEffect } from "react";
import { FileText, ShieldCheck, AlertCircle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    useCreateLegalMutation,
    useGetPrivacyPolicyQuery,
    useGetTermsAndConditionQuery,
} from "@/features/legal/legalApi";
import TiptapEditor from "@/components/content-management/TiptapEditor";
import toast from "react-hot-toast";

// ─── Component ───────────────────────────────────────────────────────────────

type TabType = "terms-and-condition" | "privacy-policy";

export default function LegalPage() {
    const [activeTab, setActiveTab] = useState<TabType>("terms-and-condition");
    const [termsContent, setTermsContent] = useState<string | null>(null);
    const [privacyContent, setPrivacyContent] = useState<string | null>(null);

    // Queries
    const { data: termsData, isLoading: isTermsLoading } = useGetTermsAndConditionQuery(undefined, {
        skip: activeTab !== "terms-and-condition"
    });

    console.log("termsData", termsData);

    const { data: privacyData, isLoading: isPrivacyLoading } = useGetPrivacyPolicyQuery(undefined, {
        skip: activeTab !== "privacy-policy"
    });

    // Mutation
    const [createLegal, { isLoading: isSaving }] = useCreateLegalMutation();

    // Sync state with fetched data
    useEffect(() => {
        if (termsData && termsContent === null) {
            setTermsContent(termsData.data?.content || "");
        }
    }, [termsData, termsContent]);

    useEffect(() => {
        if (privacyData && privacyContent === null) {
            setPrivacyContent(privacyData.data?.content || "");
        }
    }, [privacyData, privacyContent]);

    const content = activeTab === "terms-and-condition" ? termsContent : privacyContent;
    const setContent = activeTab === "terms-and-condition" ? setTermsContent : setPrivacyContent;

    const handleSave = async () => {
        if (content === null) return;
        try {
            await createLegal({
                type: activeTab,
                content: content,
            }).unwrap();
            toast.success(
                `${activeTab === "terms-and-condition" ? "Terms & Conditions" : "Privacy Policy"} saved successfully`
            );
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to save content");
        }
    };

    const handleReset = () => {
        setContent("");
        toast.success("Content cleared");
    };

    const isLoading = activeTab === "terms-and-condition" ? isTermsLoading : isPrivacyLoading;
    const isDataReady = content !== null;

    return (
        <div className="max-w-5xl space-y-4 sm:space-y-6">
            {/* ── Page Header ── */}
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-medium">Legal Content Management</h1>
                <p className="text-sm sm:text-base text-gray-500 font-normal">Edit the legal documents displayed to your users.</p>
            </div>

            {/* ── Card ── */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* ── Tabs ── */}
                <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab("terms-and-condition")}
                        className={cn(
                            "flex items-center gap-2 px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-medium transition-all relative cursor-pointer whitespace-nowrap",
                            activeTab === "terms-and-condition"
                                ? "text-[#FF4A00]"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                        Terms & Conditions
                        {activeTab === "terms-and-condition" && (
                            <motion.div
                                layoutId="tab-underline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF4A00] rounded-t-full"
                            />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("privacy-policy")}
                        className={cn(
                            "flex items-center gap-2 px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-medium transition-all relative cursor-pointer whitespace-nowrap",
                            activeTab === "privacy-policy"
                                ? "text-[#FF4A00]"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                        Privacy Policy
                        {activeTab === "privacy-policy" && (
                            <motion.div
                                layoutId="tab-underline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF4A00] rounded-t-full"
                            />
                        )}
                    </button>
                </div>

                {/* ── Content Area ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 sm:p-8 space-y-6"
                    >
                        {/* Tip Banner */}


                        {/* Text Editor */}
                        {(!isDataReady || isLoading) ? (
                            <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-xl animate-pulse text-gray-400">
                                Loading content...
                            </div>
                        ) : (
                            <TiptapEditor
                                content={content}
                                onChange={(val) => setContent(val)}
                            />
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2"> 
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full sm:w-auto cursor-pointer bg-[#FF4A00] hover:bg-[#e64300] text-white px-12 sm:px-16 h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg shadow-orange-100 transition-all active:scale-95 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}