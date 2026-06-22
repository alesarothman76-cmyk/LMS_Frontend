"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  ShieldAlert, 
  Languages, 
  LogOut, 
  Sun, 
  Moon,
  Settings,
  Palette,
  CheckCircle2,
  KeyRound
} from "lucide-react";

// --- SHADCN / DESIGN SYSTEM IMPORTS ---
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

function SettingsPageContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    }
    return false;
  });

  const [language, setLanguage] = useState("en");

  // Sync dark mode class directly with the DOM safely on value mutations
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    // Removed min-h-screen and dark background to blend seamlessly with AppLayout's main area
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-wide text-[#776d5e] font-serif flex items-center gap-3">
          <Settings className="h-7 w-7 text-[#776d5e]" />
          Account Settings
        </h1>
        <p className="text-sm font-serif italic text-[#776d5e]">
          Manage your profile information, application preferences, and active sessions.
        </p>
      </div>

      {/* SECTION 1: Profile Information */}
      <section className="bg-white border border-[#dcd6ca] rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#dcd6ca] bg-[#fbfaf8]">
          <h2 className="font-serif font-bold text-lg text-[#292520] flex items-center gap-2">
            <User className="h-5 w-5 text-[#9c8465]" />
            Profile Details
          </h2>
          <p className="text-xs text-[#776d5e] mt-0.5">Your core identity and authorization metadata.</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold uppercase text-[#776d5e] tracking-wider block">
              Full Name
            </label>
            <div className="flex items-center gap-2.5 bg-[#f7f5f0] border border-[#e6e0d4] rounded px-3 py-2.5 text-sm text-[#292520] font-medium">
              <span>{user?.fullName || "Guest Profile"}</span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold uppercase text-[#776d5e] tracking-wider block">
              Email Address
            </label>
            <div className="flex items-center gap-2.5 bg-[#f7f5f0] border border-[#e6e0d4] rounded px-3 py-2.5 text-sm text-[#292520]">
              <Mail className="h-4 w-4 text-[#a19787] shrink-0" />
              <span className="truncate">{user?.email || "No email assigned"}</span>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="font-mono text-[10px] font-bold uppercase text-[#776d5e] tracking-wider block">
              Permission Role
            </label>
            <div className="flex items-center gap-2.5 bg-[#f7f5f0] border border-[#e6e0d4] rounded px-3 py-2.5 text-sm text-[#292520] w-fit min-width: 200px;">
              <ShieldAlert className="h-4 w-4 text-[#9c8465] shrink-0" />
              <span className="font-mono font-bold uppercase tracking-wide text-[#867054]">
                {user?.role || "Member"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Preferences & Localization */}
      <section className="bg-white border border-[#dcd6ca] rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#dcd6ca] bg-[#fbfaf8]">
          <h2 className="font-serif font-bold text-lg text-[#292520] flex items-center gap-2">
            <Palette className="h-5 w-5 text-[#9c8465]" />
            Preferences
          </h2>
          <p className="text-xs text-[#776d5e] mt-0.5">Customize the interface language and visual theme.</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Language Selection */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold uppercase text-[#776d5e] tracking-wider block">
              System Language
            </label>
            <div className="relative flex items-center max-w-xs">
              <Languages className="absolute left-3 h-4 w-4 text-[#a19787] z-10 pointer-events-none" />
              <Select defaultValue={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full text-sm pl-10 pr-4 py-2.5 border border-[#dcd6ca] rounded bg-white text-[#292520] font-serif focus:outline-hidden focus:ring-2 focus:ring-[#9c8465]/50 focus:border-[#9c8465] h-10">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-[#dcd6ca] text-[#292520] font-serif">
                  <SelectItem value="en" className="text-sm focus:bg-[#efebe4] focus:text-[#292520]">English (Default)</SelectItem>
                  <SelectItem value="ar" className="text-sm focus:bg-[#efebe4] focus:text-[#292520]">العربية (Arabic)</SelectItem>
                  <SelectItem value="fr" className="text-sm focus:bg-[#efebe4] focus:text-[#292520]">Français (French)</SelectItem>
                  <SelectItem value="de" className="text-sm focus:bg-[#efebe4] focus:text-[#292520]">Deutsch (German)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold uppercase text-[#776d5e] tracking-wider block">
              Visual Theme
            </label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDarkMode(false)}
                className={`h-10 px-4 text-sm font-serif transition-all ${
                  !isDarkMode 
                    ? "bg-[#292520] text-[#fdfbf7] border-[#292520] shadow-md" 
                    : "bg-white text-[#292520] border-[#dcd6ca] hover:bg-[#f7f5f0]"
                }`}
              >
                <Sun className="h-4 w-4 mr-2 text-amber-500" />
                Light Mode
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDarkMode(true)}
                className={`h-10 px-4 text-sm font-serif transition-all ${
                  isDarkMode 
                    ? "bg-[#292520] text-[#fdfbf7] border-[#292520] shadow-md" 
                    : "bg-white text-[#292520] border-[#dcd6ca] hover:bg-[#f7f5f0]"
                }`}
              >
                <Moon className="h-4 w-4 mr-2 text-indigo-400" />
                Dark Mode
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Session Management (Danger Zone) */}
      <section className="bg-white border border-red-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#dcd6ca] bg-[#fbfaf8]">
          <h2 className="font-serif font-bold text-lg text-[#292520] flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-[#9c8465]" />
            Session Management
          </h2>
          <p className="text-xs text-[#776d5e] mt-0.5">Manage your current active session and security status.</p>
        </div>
        
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#292520]">Active Session</p>
              <p className="text-xs text-[#776d5e]">You are currently logged in and your session is secure.</p>
            </div>
          </div>
          
          <Button 
            onClick={handleLogout}
            className="bg-red-900 text-white hover:bg-red-950 font-serif text-sm px-5 py-2.5 gap-2 h-auto shrink-0"
          >
            <LogOut className="h-4 w-4" />
            <span>Disconnect & Logout</span>
          </Button>
        </div>
      </section>

    </div>
  );
}

// 🛡️ Dynamically export with SSR disabled to explicitly avoid hydration loops or cascading renders
export default dynamic(() => Promise.resolve(SettingsPageContent), {
  ssr: false,
});