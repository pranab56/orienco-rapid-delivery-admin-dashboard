"use client";

import React, { useState } from "react";
import { FileText, ShieldCheck, AlertCircle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

// ─── Default Content ────────────────────────────────────────────────────────

const DEFAULT_TERMS = `### 1. Introduction
Welcome to Modulix Market. By accessing our platform, you agree to these terms. Please read them carefully.

### 2. Service Usage
Our platform connects suppliers with businesses for bulk purchasing. You agree to use the service only for lawful purposes and in accordance with these Terms.
* You must provide accurate account information.
* You are responsible for maintaining the confidentiality of your account.
* Unauthorized use of the platform is strictly prohibited.

### 3. Orders & Payments
All orders are subject to acceptance and availability. Prices are subject to change without notice. We reserve the right to refuse service to anyone.

### 4. Intellectual Property
All content, branding, and materials on the platform are the exclusive property of Modulix Market and are protected by applicable intellectual property laws.

### 5. Limitations of Liability
Modulix Market shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.

### 6. Governing Law
These Terms are governed by and construed in accordance with the laws of the applicable jurisdiction.`;

const DEFAULT_PRIVACY = `### 1. Information We Collect
We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

### 2. How We Use Your Information
We use the information we collect to:
* Provide, maintain, and improve our services.
* Process transactions and send related information.
* Send promotional communications (with your consent).

### 3. Information Sharing
We do not share your personal information with third parties except as described in this Privacy Policy.

### 4. Data Security
We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.

### 5. Cookies
We use cookies and similar tracking technologies to track activity on our platform and hold certain information.

### 6. Contact Us
If you have any questions about this Privacy Policy, please contact us at privacy@modulixmarket.com.`;

// ─── Component ───────────────────────────────────────────────────────────────

type TabType = "terms" | "privacy";

export default function LegalPage() {
    const [activeTab, setActiveTab] = useState<TabType>("terms");
    const [termsContent, setTermsContent] = useState(DEFAULT_TERMS);
    const [privacyContent, setPrivacyContent] = useState(DEFAULT_PRIVACY);

    const content = activeTab === "terms" ? termsContent : privacyContent;
    const setContent = activeTab === "terms" ? setTermsContent : setPrivacyContent;
    const defaultContent = activeTab === "terms" ? DEFAULT_TERMS : DEFAULT_PRIVACY;

    const handleSave = () => {
        toast.success(
            `${activeTab === "terms" ? "Terms & Conditions" : "Privacy Policy"} saved successfully`
        );
    };

    const handleReset = () => {
        setContent(defaultContent);
        toast.success("Content reset to default");
    };

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
                        onClick={() => setActiveTab("terms")}
                        className={cn(
                            "flex items-center gap-2 px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-medium transition-all relative cursor-pointer whitespace-nowrap",
                            activeTab === "terms"
                                ? "text-[#FF4A00]"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                        Terms & Conditions
                        {activeTab === "terms" && (
                            <motion.div
                                layoutId="tab-underline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF4A00] rounded-t-full"
                            />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("privacy")}
                        className={cn(
                            "flex items-center gap-2 px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-medium transition-all relative cursor-pointer whitespace-nowrap",
                            activeTab === "privacy"
                                ? "text-[#FF4A00]"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                        Privacy Policy
                        {activeTab === "privacy" && (
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
                        <div className="flex items-start gap-3 bg-[#FFF8F0] border border-orange-100 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-3.5">
                            <AlertCircle className="w-5 h-5 text-[#FF4A00] mt-0.5 shrink-0" />
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                Tip: You can use Markdown-like syntax for headers (
                                <span className="font-mono text-[10px] sm:text-xs bg-gray-100 px-1.5 py-0.5 rounded">### Header</span>
                                ) and bullet points (
                                <span className="font-mono text-[10px] sm:text-xs bg-gray-100 px-1.5 py-0.5 rounded">* Item</span>
                                ). Currently editing in{" "}
                                <span className="font-semibold text-[#FF4A00]">Plain Text</span> mode.
                            </p>
                        </div>

                        {/* Text Editor */}
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={12}
                            spellCheck={false}
                            className="w-full bg-[#FAFAFA] rounded-xl border border-gray-100 p-4 sm:p-6 font-mono text-xs sm:text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#FF4A00]/10 focus:border-[#FF4A00]/20 transition-all placeholder:text-gray-400"
                            placeholder="Start typing your content..."
                        />

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-xs sm:text-sm font-medium transition-colors cursor-pointer group order-2 sm:order-1"
                            >
                                <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-45" />
                                Reset to Default
                            </button>

                            <button
                                onClick={handleSave}
                                className="w-full sm:w-auto bg-[#FF4A00] hover:bg-[#e64300] text-white px-12 sm:px-16 h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg shadow-orange-100 transition-all active:scale-95 order-1 sm:order-2"
                            >
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}