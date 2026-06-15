"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  FileCode,
  Layers,
  Database,
  BookOpen,
  Image as ImageIcon,
  Settings,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  HelpCircle,
  Clock,
  Cpu,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  { name: "Main Dashboard", href: "/", icon: Home, description: "Main control panel" },
  {
    name: "Resource Templates",
    href: "/resourceTemplate",
    icon: FileCode,
    description: "Manage and design structures and data resource templates",
  },
  {
    name: "Vocabularies",
    href: "/vocabularies",
    icon: Layers,
    description: "Manage namespaces, prefixes, and terms",
  },
  { name: "Items", href: "/items", icon: Database, description: "Browse and manage individual data items" },
  {
    name: "Item Sets",
    href: "/itemSets",
    icon: BookOpen,
    description: "Organize items into structured, consistent collections",
  },
  {
    name: "Media",
    href: "/media",
    icon: ImageIcon,
    description: "Manage images and files attached to resources",
  },
  { name: "Settings", href: "/settings", icon: Settings, description: "System settings and general configuration" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    }
    return false;
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true";
    }
    return false;
  });

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Synchronize Sidebar states to storage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Toggle Sidebar Collapse
  const toggleSidebar = () => {
    const nextCollapsed = !isSidebarCollapsed;
    setIsSidebarCollapsed(nextCollapsed);
    localStorage.setItem("sidebar-collapsed", String(nextCollapsed));
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Get active page name for breadcrumb/title
  const currentItem = navigationItems.find(
    (item) => item.href === pathname || (item.href !== "/" && pathname.startsWith(item.href))
  );
  const pageTitle = currentItem ? currentItem.name : "Metadata Management System (LMS)";

  return (
    <div className="min-h-screen bg-[#3a352e] text-[#f4f1eb] flex flex-col font-serif transition-colors duration-200 selection:bg-[#9c8465] selection:text-white" dir="ltr">
      
      {/* --- TOP BANNER --- */}
      <header className="relative min-h-[220px] bg-neutral-950 border-b border-[#4d463d] overflow-hidden flex flex-col justify-between p-4 sm:p-6">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-20 pointer-events-none transform scale-105"
          style={{ backgroundImage: `url('https://wallpaperaccess.com/full/253342.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#181614]/90 pointer-events-none" />

        {/* Top Header Row Utilities */}
        <div className="relative z-10 flex flex-wrap gap-4 justify-between items-center text-xxs tracking-wider uppercase text-[#c0b7a8]/70 font-mono" dir="ltr">
          <div className="flex items-center gap-2 bg-black/40 border border-[#524a3e] px-2.5 py-1 rounded backdrop-blur-sm">
            <Cpu className="h-3 w-3 text-[#9c8465]" />
            <span>FEDERATED NODE ID: <span className="text-[#e2dacb]">DLMS-PROD-LWS-001</span></span>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <span>UTC RECORDING TIMESTAMP: <span className="text-[#e2dacb]">2026-06-05 22:04:12</span></span>
            </div>
            
            {/* User Profile Button Action Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-1.5 bg-black/40 hover:bg-neutral-900 border border-[#524a3e] px-2.5 py-1 rounded relative transition-colors"
              >
                <User className="h-3 w-3 text-[#9c8465]" />
                <span className="lowercase font-sans text-xs text-[#e2dacb]">librarian@lms.local</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#2c2822] border border-[#524a3e] rounded shadow-xl py-2 z-50 text-left font-serif" dir="ltr">
                  <div className="px-4 py-2 border-b border-[#413b32] sm:hidden">
                    <p className="font-bold text-xs text-[#fdfbf7]">Librarian</p>
                    <p className="text-xxs text-[#9c8465]">librarian@lms.local</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-xs text-[#b2a899] hover:bg-[#3e3830] hover:text-[#fdfbf7]"
                  >
                    <User className="h-4 w-4 text-[#9c8465]" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-xs text-[#b2a899] hover:bg-[#3e3830] hover:text-[#fdfbf7]"
                  >
                    <Settings className="h-4 w-4 text-[#9c8465]" />
                    <span>Account Settings</span>
                  </Link>
                  <div className="border-t border-[#413b32] my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-xs text-red-400 hover:bg-red-950/20"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Central Display Header */}
        <div className="relative z-10 my-4 text-left">
          <p className="text-xxs tracking-widest font-mono text-[#9c8465] uppercase mb-1">
            UNIVERSITY OF CAIRO • DIGITAL LIBRARY MANAGEMENT SYSTEM (DLMS)
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide text-[#fdfbf7] font-serif mb-2">
            Academic Digital Library Management System
          </h1>
          <p className="text-xs italic font-serif text-[#c5bcae] max-w-4xl tracking-wide opacity-90">
            Empowering bilingual manuscripts codicology curation, active metadata namespaces indexing, and federated media storage checks.
          </p>
        </div>

        {/* Subtitle Architecture Row & Notifications Controls */}
        <div className="relative z-10 flex justify-between items-center text-xxs font-mono text-[#a19787] border-t border-[#443d34]/60 pt-3 mt-2">
          <div>DEC DECOUPLED ARCHITECTURE • ASP.NET CORE v8 BACKEND BINDINGS</div>
          
          <div className="flex items-center gap-4">
            {/* Notification Logic Integration */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="hover:text-[#fdfbf7] relative flex items-center gap-1.5"
                aria-label="Notifications"
              >
                <Bell className="h-3.5 w-3.5" />
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-[#2c2822] border border-[#524a3e] rounded shadow-xl py-3 z-50 text-left font-serif" dir="ltr">
                  <div className="px-4 py-2 border-b border-[#413b32] flex justify-between items-center">
                    <span className="font-bold text-sm text-[#fdfbf7]">Notifications</span>
                    <button className="text-xxs text-blue-400 hover:underline">Mark all as read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto px-2 py-1 space-y-1 text-xs text-[#b2a899]">
                    <div className="p-2.5 rounded hover:bg-[#322d26]">
                      <p className="font-semibold text-[#fdfbf7]">Textbook template created successfully</p>
                      <span className="text-xxs text-[#9c8465]">2 minutes ago</span>
                    </div>
                    <div className="p-2.5 rounded hover:bg-[#322d26]">
                      <p className="font-semibold text-[#fdfbf7]">A new item has been linked to an external term</p>
                      <span className="text-xxs text-[#9c8465]">1 hour ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Logic Integration */}
            <button onClick={toggleDarkMode} className="hover:text-[#fdfbf7]">
              {mounted ? (
                isDarkMode ? <Sun className="h-3.5 w-3.5 text-amber-500" /> : <Moon className="h-3.5 w-3.5 text-indigo-400" />
              ) : (
                <span className="h-3.5 w-3.5 inline-block" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTENT CONTAINER WORKSPACE --- */}
      <div className="flex-1 flex flex-col md:flex-row bg-[#211e1a]">
        
        {/* LEFT SIDEBAR PANEL */}
        <aside
          className={cn(
            "hidden md:flex flex-col border-r border-[#413b32] bg-[#2c2822] transition-all duration-300 ease-in-out relative z-30 shrink-0",
            isSidebarCollapsed ? "w-20" : "w-64"
          )}
        >
          {/* Internal Title Header */}
          <div className="h-14 flex items-center px-4 border-b border-[#413b32] bg-[#24211c] justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-1.5 bg-[#3e3830] border border-[#564e43] rounded text-[#cbbfae] shrink-0">
                <Bookmark className="h-4 w-4" />
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col text-left">
                  <span className="font-mono text-xs uppercase font-bold text-[#fdfbf7] tracking-wider">
                    DLMS CONSOLE
                  </span>
                  <span className="font-mono text-xxs text-[#9c8465]">
                    Build Version 1.0.42
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Collapse Toggle Trigger */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-16 bg-[#2c2822] border border-[#524a3e] rounded-full p-1 text-[#b2a899] hover:text-[#fdfbf7] transition-all shadow-sm z-40"
            aria-label="Toggle Sidebar"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Navigation Iteration Block */}
          <nav className="flex-1 py-4 px-2 space-y-1 bg-[#26221e] overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all group relative border",
                    isActive
                      ? "bg-[#ecdcc5] text-[#29241e] border-[#eedfcb] font-bold shadow-inner"
                      : "text-[#b2a899] bg-transparent border-transparent hover:bg-[#322d26] hover:text-[#fdfbf7]"
                  )}
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform group-hover:scale-105",
                      isActive ? "text-[#75634a]" : "text-[#776d5e]"
                    )}
                  />
                  {!isSidebarCollapsed && (
                    <span className="truncate text-xs tracking-wide">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Area Link */}
          <div className="p-2 bg-[#211e1a] border-t border-[#413b32]">
            <Link
              href="/docs"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded text-xs text-[#b2a899] hover:text-[#fdfbf7] hover:bg-[#322d26] transition-all",
                isSidebarCollapsed && "justify-center"
              )}
            >
              <HelpCircle className="h-4 w-4 text-[#776d5e]" />
              {!isSidebarCollapsed && <span>Help & Docs</span>}
            </Link>
          </div>
        </aside>

        {/* MOBILE MENU NAVIGATION DRAWER OVERLAY */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <aside className="relative flex flex-col w-64 max-w-xs bg-[#2c2822] h-full border-r border-[#413b32] z-50">
              <div className="h-16 flex items-center px-4 bg-[#24211c] border-b border-[#413b32] justify-between">
                <span className="font-bold text-sm text-[#fdfbf7]">LMS System</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#b2a899] hover:text-[#fdfbf7]">
                  Open Menu
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1 bg-[#26221e] overflow-y-auto">
                {navigationItems.map((item) => {
                  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded text-xs border transition-all",
                        isActive ? "bg-[#ecdcc5] text-[#29241e] border-[#eedfcb]" : "text-[#b2a899] border-transparent hover:bg-[#322d26]"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 bg-[#211e1a] border-t border-[#413b32] space-y-2">
                <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2.5 rounded text-xs text-red-400 hover:bg-red-950/20">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* WORKSPACE AREA CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          
          {/* Breadcrumb Navbar Layout Alignment */}
          <div className="h-12 border-b border-[#413b32] bg-[#24211c]/80 backdrop-blur-md flex items-center px-4 justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-[#b2a899] hover:text-[#fdfbf7]"
                aria-label="Open sidebar menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div className="hidden sm:flex items-center gap-1.5 text-xxs font-mono text-[#9c8465]">
                <span>Home</span>
                <span>/</span>
                <span className="text-[#fdfbf7] font-medium">{pageTitle}</span>
              </div>
            </div>

            {/* Global Search Input Field Context */}
            <div className="hidden lg:flex w-80 relative items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-[#776d5e]" />
              <input
                type="text"
                placeholder="Search template, item, or value..."
                className="w-full text-xs pl-9 pr-4 py-1.5 border border-[#524a3e] rounded bg-[#1c1916] text-[#f4f1eb] placeholder-[#776d5e] focus:outline-none focus:border-[#9c8465] text-left font-serif"
              />
            </div>
          </div>

          {/* Dynamic Content Workspace Rendering Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#efebe4] text-[#292520]">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}