"use client";

import React, { useState, useEffect } from "react";
import { X, User, Sprout, Landmark, Check, Plus } from "lucide-react";
import { useFarmerProfile } from "@/lib/farmer-profile-context";
import { CROPS } from "@/data/mock";

export function ProfileModal() {
  const { profile, updateProfile, isProfileOpen, setIsProfileOpen } = useFarmerProfile();

  const [name, setName] = useState(profile.name);
  const [acres, setAcres] = useState(profile.acres);
  const [village, setVillage] = useState(profile.village || "");
  const [district, setDistrict] = useState(profile.district || "");
  const [state, setState] = useState(profile.state || "");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(profile.crops);
  const [customCrop, setCustomCrop] = useState("");
  const [accountHolder, setAccountHolder] = useState(profile.bankAccount.accountHolder);
  const [accountNumber, setAccountNumber] = useState(profile.bankAccount.accountNumber);
  const [ifscCode, setIfscCode] = useState(profile.bankAccount.ifscCode);
  const [bankName, setBankName] = useState(profile.bankAccount.bankName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isProfileOpen) {
      setName(profile.name);
      setAcres(profile.acres);
      setVillage(profile.village || "");
      setDistrict(profile.district || "");
      setState(profile.state || "");
      setSelectedCrops(profile.crops);
      setAccountHolder(profile.bankAccount.accountHolder);
      setAccountNumber(profile.bankAccount.accountNumber);
      setIfscCode(profile.bankAccount.ifscCode);
      setBankName(profile.bankAccount.bankName);
      setSavedSuccess(false);
    }
  }, [isProfileOpen, profile]);

  if (!isProfileOpen) return null;

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter((c) => c !== crop));
      }
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const handleAddCustomCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCrop.trim() && !selectedCrops.includes(customCrop.trim())) {
      setSelectedCrops([...selectedCrops, customCrop.trim()]);
      setCustomCrop("");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || profile.name,
      acres: acres.trim() || profile.acres,
      village: village.trim() || profile.village,
      district: district.trim() || profile.district,
      state: state.trim() || profile.state,
      location: `${village.trim() || profile.village}, ${district.trim() || profile.district}`,
      crops: selectedCrops,
      bankAccount: {
        accountHolder: accountHolder.trim() || profile.bankAccount.accountHolder,
        accountNumber: accountNumber.trim() || profile.bankAccount.accountNumber,
        ifscCode: ifscCode.trim().toUpperCase() || profile.bankAccount.ifscCode,
        bankName: bankName.trim() || profile.bankAccount.bankName,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsProfileOpen(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-km-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-km-neutral-200/80 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-km-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D9A441]/20 flex items-center justify-center text-[#D9A441]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-fraunces text-km-neutral-900">
                Farmer Profile & Settings
              </h2>
              <p className="text-xs text-km-neutral-500">
                Update your location, farm size, crops grown, and bank details
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="p-2 rounded-xl text-km-neutral-400 hover:text-km-neutral-700 hover:bg-km-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-km-neutral-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Personal & Farm Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-km-neutral-700 mb-1.5">
                  Your Name / Username
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-km-neutral-200 text-sm font-semibold text-km-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D9A441] focus:border-transparent bg-km-neutral-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-km-neutral-700 mb-1.5">
                  Number of Acres Owned
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                    required
                    placeholder="e.g. 4.5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-km-neutral-200 text-sm font-semibold text-km-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D9A441] focus:border-transparent bg-km-neutral-50/50"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-km-neutral-400 font-semibold">
                    Acres
                  </span>
                </div>
              </div>
            </div>

            {/* Location Fields: Village Name, District, State */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-km-neutral-700 mb-1.5">
                  Village Name
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  required
                  placeholder="e.g. Tadikonda"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-km-neutral-200 text-sm font-semibold text-km-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D9A441] focus:border-transparent bg-km-neutral-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-km-neutral-700 mb-1.5">
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  placeholder="e.g. Guntur"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-km-neutral-200 text-sm font-semibold text-km-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D9A441] focus:border-transparent bg-km-neutral-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-km-neutral-700 mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  placeholder="e.g. Andhra Pradesh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-km-neutral-200 text-sm font-semibold text-km-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D9A441] focus:border-transparent bg-km-neutral-50/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Types of Crops Grown */}
          <div className="space-y-3 pt-2 border-t border-km-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-km-neutral-400 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#7CB342]" />
              <span>Types of Crops Grown (Select all that apply)</span>
            </h3>

            <div className="flex flex-wrap gap-2 pt-1">
              {CROPS.map((crop) => {
                const isSelected = selectedCrops.includes(crop);
                return (
                  <button
                    type="button"
                    key={crop}
                    onClick={() => toggleCrop(crop)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#0E2318] text-[#F4F1E4] shadow-xs"
                        : "bg-km-neutral-100 text-km-neutral-600 hover:bg-km-neutral-200"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-[#7CB342]" />}
                    <span>{crop}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom crop entry */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customCrop}
                onChange={(e) => setCustomCrop(e.target.value)}
                placeholder="Add other crop..."
                className="px-3 py-1.5 text-xs rounded-xl border border-km-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
              />
              <button
                type="button"
                onClick={handleAddCustomCrop}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-km-neutral-100 hover:bg-km-neutral-200 text-km-neutral-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Section 3: Bank Account Details */}
          <div className="space-y-4 pt-2 border-t border-km-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-km-neutral-400 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Bank Account Details (For direct payments)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-km-neutral-700 mb-1.5">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-km-neutral-200 text-sm font-semibold text-km-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D9A441] bg-km-neutral-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-km-neutral-700 mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. State Bank of India"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-km-neutral-200 text-sm font-semibold text-km-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D9A441] bg-km-neutral-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-km-neutral-700 mb-1.5">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 918234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-km-neutral-200 text-sm font-semibold text-km-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D9A441] bg-km-neutral-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-km-neutral-700 mb-1.5">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SBIN0001234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-km-neutral-200 text-sm font-semibold text-km-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D9A441] bg-km-neutral-50/50"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-km-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsProfileOpen(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-km-neutral-600 hover:bg-km-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#D9A441] text-[#0E2318] hover:bg-[#C08A2E] shadow-sm transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
