"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, CirclePlus, CircleMinus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  type: "user" | "driver";
}

const initialFaqs: FAQ[] = [
  {
    id: "1",
    question: "1. What is Tradelock?",
    answer: "Absolutely. From job discovery and applications to hiring and communication, HireMe keeps everything organized in one platform.",
    type: "user",
  },
  {
    id: "2",
    question: "Is Tradelock suitable for solo job seekers?",
    answer: "Absolutely. From job discovery and applications to hiring and communication, HireMe keeps everything organized in one platform.",
    type: "user",
  },
  {
    id: "3",
    question: "Can companies and individuals both create accounts?",
    answer: "Absolutely. From job discovery and applications to hiring and communication, HireMe keeps everything organized in one platform.",
    type: "user",
  },
  {
    id: "4",
    question: "Is Tradelock free to use?",
    answer: "Absolutely. From job discovery and applications to hiring and communication, HireMe keeps everything organized in one platform.",
    type: "user",
  },
  {
    id: "5",
    question: "How does Tradelock ensure quality matches?",
    answer: "Absolutely. From job discovery and applications to hiring and communication, HireMe keeps everything organized in one platform.",
    type: "user",
  },
  {
    id: "6",
    question: "Can I manage everything in one place?",
    answer: "Absolutely. From job discovery and applications to hiring and communication, HireMe keeps everything organized in one platform.",
    type: "user",
  },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [activeTab, setActiveTab] = useState<"user" | "driver">("user");
  const [expandedId, setExpandedId] = useState<string | null>("6");

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<FAQ | null>(null);

  // Form states
  const [formData, setFormData] = useState({ question: "", answer: "" });

  const filteredFaqs = faqs.filter((faq) => faq.type === activeTab);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAdd = () => {
    if (!formData.question || !formData.answer) {
      toast.error("Please fill in all fields");
      return;
    }
    const newFaq: FAQ = {
      id: Math.random().toString(36).substr(2, 9),
      question: formData.question,
      answer: formData.answer,
      type: activeTab,
    };
    setFaqs([...faqs, newFaq]);
    setIsAddOpen(false);
    setFormData({ question: "", answer: "" });
    toast.success("FAQ added successfully");
  };

  const handleEdit = (faq: FAQ) => {
    setCurrentFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!formData.question || !formData.answer || !currentFaq) return;
    setFaqs(
      faqs.map((f) =>
        f.id === currentFaq.id
          ? { ...f, question: formData.question, answer: formData.answer }
          : f
      )
    );
    setIsEditOpen(false);
    setCurrentFaq(null);
    setFormData({ question: "", answer: "" });
    toast.success("FAQ updated successfully");
  };

  const handleDelete = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
    toast.success("FAQ deleted successfully");
  };

  return (
    <div className="">
      <div className="flex flex-col gap-6">
        {/* Tabs */}
        <Tabs
          defaultValue="user"
          className="w-full"
          onValueChange={(v) => setActiveTab(v as "user" | "driver")}
        >
          <TabsList className="bg-gray-200/50 p-1 h-12 rounded-lg w-[300px]">
            <TabsTrigger
              value="user"
              className="flex-1 h-full rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-gray-600 cursor-pointer data-[state=active]:text-gray-900 font-medium transition-all"
            >
              User
            </TabsTrigger>
            <TabsTrigger
              value="driver"
              className="flex-1 h-full rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-gray-600 cursor-pointer data-[state=active]:text-gray-900 font-medium transition-all"
            >
              Driver
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="bg-white rounded-lg p-5 shadow-none border border-gray-100">
              <div className="flex flex-col">
                {filteredFaqs.map((faq, index) => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    index={index}
                    isExpanded={expandedId === faq.id}
                    onToggle={() => handleToggle(faq.id)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {filteredFaqs.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <p>No FAQs available for this category.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#EA4335] hover:bg-[#D33828] text-white px-8 py-6 rounded-lg text-base font-medium shadow-lg shadow-orange-200 transition-all active:scale-95"
          >
            Add New FAQ
          </Button>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl border-none shadow-2xl">
          <div className="bg-[#EAEAEA] p-8 space-y-8">
            <div className="relative">
              <DialogTitle className="text-2xl font-medium text-center text-[#2C2E33]">
                Add New FAQ
              </DialogTitle>

            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800 ml-1">Question</Label>
                <Input
                  placeholder="Enter your question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="bg-[#E5E1DA] border-none h-14 rounded-xl px-4 text-gray-800 placeholder:text-gray-500 text-lg focus-visible:ring-1 focus-visible:ring-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800 ml-1">Answer</Label>
                <Textarea
                  placeholder="Enter your answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="bg-[#E5E1DA] border-none min-h-[140px] rounded-xl px-4 py-4 text-gray-800 placeholder:text-gray-500 text-lg focus-visible:ring-1 focus-visible:ring-gray-400 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleAdd}
                className="bg-[#EA4335] hover:bg-[#D33828] text-white px-20 h-12 rounded-xl text-base font-medium shadow-lg"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
          <div className="bg-[#EAEAEA] p-8 space-y-8">
            <div className="relative">
              <DialogTitle className="text-2xl font-medium text-center text-[#2C2E33]">
                Edit FAQ
              </DialogTitle>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800 ml-1">Question</Label>
                <Input
                  placeholder="Enter your question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="bg-[#E5E1DA] border-none h-14 rounded-xl px-4 text-gray-800 placeholder:text-gray-500 text-lg focus-visible:ring-1 focus-visible:ring-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800 ml-1">Answer</Label>
                <Textarea
                  placeholder="Enter your answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="bg-[#E5E1DA] border-none min-h-[140px] rounded-xl px-4 py-4 text-gray-800 placeholder:text-gray-500 text-lg focus-visible:ring-1 focus-visible:ring-gray-400 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSaveEdit}
                className="bg-[#EA4335] hover:bg-[#D33828] text-white px-20 h-12 rounded-xl text-base font-medium shadow-lg"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FAQItem({
  faq,
  index,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  faq: FAQ;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (faq: FAQ) => void;
  onDelete: (id: string) => void;
}) {
  const number = (index + 1).toString().padStart(2, "0");

  return (
    <div className="py-8 border-b border-gray-300/60 last:border-0">
      <div className="flex items-start gap-10">
        {/* Left column: Number and Actions */}
        <div className="flex flex-col items-center gap-4 mt-1 space-y-5">
          <span className="text-2xl font-bold text-[#2C2E33] leading-none min-w-[34px]">{number}</span>
          <div className="flex items-center gap-5 pl-4">
            <button
              onClick={() => onEdit(faq)}
              className="text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
            >
              <Pencil size={20} />
            </button>
            <button
              onClick={() => onDelete(faq.id)}
              className="text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Middle column: Question and Answer */}
        <div className="flex-1 space-y-3 pr-4">
          <div
            onClick={onToggle}
            className="cursor-pointer"
          >
            <h3 className={cn(
              "text-xl font-semibold leading-snug transition-colors",
              isExpanded ? "text-gray-900" : "text-gray-800"
            )}>
              {faq.question}
            </h3>
          </div>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-1">
                  <p className="text-gray-600 text-[17px] leading-relaxed font-normal">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: Toggle Button */}
        <button
          onClick={onToggle}
          className="text-gray-900 hover:opacity-70 cursor-pointer transition-all mt-0.5"
        >
          {isExpanded ? (
            <CircleMinus size={42} strokeWidth={1} className="text-gray-900" />
          ) : (
            <CirclePlus size={42} strokeWidth={1} className="text-gray-900" />
          )}
        </button>
      </div>
    </div>
  );
}