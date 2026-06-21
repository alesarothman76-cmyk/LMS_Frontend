"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { UserRole } from "@/features/auth/types";
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
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- SHADCN/UI DESIGN SYSTEM IMPORTS ---
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  allowedRoles?: UserRole[]; // Strongly typed to match UserRole union constraints
}

const navigationItems: NavigationItem[] = [
  { 
    name: "Main Dashboard", 
    href: "/", 
    icon: Home, 
    description: "Main control panel" 
  },
  {
    name: "Resource Templates",
    href: "/resourceTemplate",
    icon: FileCode,
    description: "Manage and design structures and data resource templates",
    allowedRoles: ["Admin", "Librarian"],
  },
  {
    name: "Vocabularies",
    href: "/vocabularies",
    icon: Layers,
    description: "Manage namespaces, prefixes, and terms",
  },
  { 
    name: "Items", 
    href: "/items", 
    icon: Database, 
    description: "Browse and manage individual data items" 
  },
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
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Manage user roles and account status",
    allowedRoles: ["Admin"],
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings, 
    description: "System settings and general configuration" 
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, isAuthenticated, logout, hasRole, setRole } = useAuth();

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

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  // 🛠️ Dynamic Role Filtering Matrix matching middleware specifications
  const visibleNavigationItems = navigationItems.filter((item) => {
    if (!item.allowedRoles) return true;
    if (!mounted) return false;
    return hasRole(item.allowedRoles);
  });

  const currentItem = visibleNavigationItems.find(
    (item) => item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );
  const pageTitle = currentItem ? currentItem.name : "Metadata Management System (LMS)";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-[#3a352e] text-[#f4f1eb] flex flex-col font-serif transition-colors duration-200 selection:bg-[#9c8465] selection:text-white" dir="ltr">
        
        {/* --- TOP BANNER --- */}
        <header className="relative min-h-55 bg-neutral-950 border-b border-[#4d463d] overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-20 pointer-events-none transform scale-105"
            style={{ backgroundImage: `url('https://wallpaperaccess.com/full/253342.jpg')` }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-[#181614]/90 pointer-events-none" />

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
              
              {/* Fixed Dropdown Wrapper: Evaluated completely outside the Trigger boundary */}
              {mounted && isAuthenticated && user && (
                <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-black/40 hover:bg-neutral-900 border-[#524a3e] px-2.5 py-1 h-auto font-normal text-[#e2dacb] data-[state=open]:bg-neutral-900"
                    >
                      <Avatar className="h-4 w-4 rounded-full">
                        <AvatarFallback className="bg-transparent text-[#9c8465] text-[10px] font-mono p-0 flex items-center justify-center">
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="lowercase font-sans text-xs">{user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#2c2822] border-[#524a3e] text-[#f4f1eb] font-serif shadow-xl">
                    <DropdownMenuLabel className="font-serif px-4 py-2 border-b border-[#413b32]">
                      <p className="font-bold text-xs text-[#fdfbf7] truncate">{user.fullName}</p>
                      <p className="text-xxs font-mono normal-case text-[#9c8465] font-normal truncate">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild className="focus:bg-[#3e3830] focus:text-[#fdfbf7] cursor-pointer text-xs px-4 py-2">
                      <Link href="/profile" className="flex items-center gap-3 w-full">
                        <User className="h-4 w-4 text-[#9c8465]" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-[#3e3830] focus:text-[#fdfbf7] cursor-pointer text-xs px-4 py-2">
                      <Link href="/settings" className="flex items-center gap-3 w-full">
                        <Settings className="h-4 w-4 text-[#9c8465]" />
                        <span>Account Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#413b32]" />
                    <DropdownMenuItem onClick={handleLogout} className="focus:bg-red-950/20 text-red-400 focus:text-red-300 cursor-pointer text-xs px-4 py-2">
                      <div className="flex items-center gap-3 w-full">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Central Display Header */}
          <div className="relative z-10 my-4 text-left">
            <p className="text-xxs tracking-widest font-mono text-[#9c8465] uppercase mb-1">
               DIGITAL LIBRARY MANAGEMENT SYSTEM (DLMS)
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-wide text-[#fdfbf7] font-serif mb-2">
              Academic Digital Library Management System
            </h1>
            <p className="text-xs italic font-serif text-[#c5bcae] max-w-4xl tracking-wide opacity-90">
              Empowering bilingual manuscripts codicology curation, active metadata namespaces indexing, and federated media storage checks.
            </p>
          </div>

          {/* Subtitle Navigation Row & Notifications Controls */}
          <div className="relative z-10 flex justify-between items-center text-xxs font-mono text-[#a19787] border-t border-[#443d34]/60 pt-3 mt-2">
            <div>Welcome to the Academic Digital Library Management System</div>
            
            <div className="flex items-center gap-4">
              <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-[#fdfbf7] relative h-7 w-7 p-0 text-[#a19787] hover:bg-neutral-900/40"
                    aria-label="Notifications"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 absolute top-1 right-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-[#2c2822] border-[#524a3e] font-serif shadow-xl text-[#f4f1eb] py-2">
                  <div className="px-4 py-2 border-b border-[#413b32] flex justify-between items-center">
                    <span className="font-bold text-sm text-[#fdfbf7]">Notifications</span>
                    <Button variant="link" className="text-xxs text-blue-400 hover:underline p-0 h-auto font-normal">Mark all as read</Button>
                  </div>
                  <ScrollArea className="h-64 px-2 py-1">
                    <div className="space-y-1 text-xs text-[#b2a899]">
                      <div className="p-2.5 rounded hover:bg-[#322d26] transition-colors">
                        <p className="font-semibold text-[#fdfbf7]">Textbook template created successfully</p>
                        <span className="text-xxs font-mono text-[#9c8465]">2 minutes ago</span>
                      </div>
                      <div className="p-2.5 rounded hover:bg-[#322d26] transition-colors">
                        <p className="font-semibold text-[#fdfbf7]">A new item has been linked to an external term</p>
                        <span className="text-xxs font-mono text-[#9c8465]">1 hour ago</span>
                      </div>
                    </div>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleDarkMode} 
                className="hover:text-[#fdfbf7] h-7 w-7 p-0 text-[#a19787] hover:bg-neutral-900/40"
              >
                {mounted ? (
                  isDarkMode ? <Sun className="h-3.5 w-3.5 text-amber-500" /> : <Moon className="h-3.5 w-3.5 text-indigo-400" />
                ) : (
                  <span className="h-3.5 w-3.5 inline-block" />
                )}
              </Button>
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
            <div className="h-14 flex items-center px-4 border-b border-[#413b32] bg-[#24211c] justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-1.5 bg-[#3e3830] border border-[#564e43] rounded text-[#cbbfae] shrink-0">
                  <Bookmark className="h-4 w-4" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex flex-col text-left animate-in fade-in duration-200">
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

            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="absolute -right-3 top-16 bg-[#2c2822] border-[#524a3e] hover:bg-[#322d26] rounded-full h-6 w-6 p-0 text-[#b2a899] hover:text-[#fdfbf7] transition-all shadow-sm z-40"
              aria-label="Toggle Sidebar"
            >
              {isSidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </Button>

            <ScrollArea className="flex-1 bg-[#26221e]">
              <nav className="py-4 px-2 space-y-1">
                {visibleNavigationItems.map((item) => {
                  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  
                  const linkContent = (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all group relative border w-full",
                        isActive
                          ? "bg-[#ecdcc5] text-[#29241e] border-[#eedfcb] font-bold shadow-inner"
                          : "text-[#b2a899] bg-transparent border-transparent hover:bg-[#322d26] hover:text-[#fdfbf7]"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform group-hover:scale-105",
                          isActive ? "text-[#75634a]" : "text-[#776d5e]"
                        )}
                      />
                      {!isSidebarCollapsed && (
                        <span className="truncate text-xs tracking-wide animate-in fade-in duration-200">{item.name}</span>
                      )}
                    </Link>
                  );

                  return isSidebarCollapsed ? (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="bg-[#2c2822] border border-[#524a3e] text-[#f4f1eb] font-serif text-xs">
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <React.Fragment key={item.href}>{linkContent}</React.Fragment>
                  );
                })}
              </nav>
            </ScrollArea>

            <div className="p-2 bg-[#211e1a] border-t border-[#413b32]">
              {isSidebarCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/docs"
                      className="flex items-center justify-center p-2.5 rounded text-xs text-[#b2a899] hover:text-[#fdfbf7] hover:bg-[#322d26] transition-all"
                    >
                      <HelpCircle className="h-4 w-4 text-[#776d5e]" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-[#2c2822] border border-[#524a3e] text-[#f4f1eb] font-serif text-xs">
                    Help & Docs
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  href="/docs"
                  className="flex items-center gap-3 px-3 py-2.5 rounded text-xs text-[#b2a899] hover:text-[#fdfbf7] hover:bg-[#322d26] transition-all"
                >
                  <HelpCircle className="h-4 w-4 text-[#776d5e]" />
                  <span>Help & Docs</span>
                </Link>
              )}
            </div>
          </aside>

          {/* MOBILE MENU NAVIGATION DRAWER OVERLAY */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
              <aside className="relative flex flex-col w-64 max-w-xs bg-[#2c2822] h-full border-r border-[#413b32] z-50">
                <div className="h-16 flex items-center px-4 bg-[#24211c] border-b border-[#413b32] justify-between">
                  <span className="font-bold text-sm text-[#fdfbf7]">LMS System</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="text-[#b2a899] hover:text-[#fdfbf7] h-8 w-8 p-0 hover:bg-neutral-900/40"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <ScrollArea className="flex-1 bg-[#26221e]">
                  <nav className="p-3 space-y-1">
                    {visibleNavigationItems.map((item) => {
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
                </ScrollArea>
                <div className="p-4 bg-[#211e1a] border-t border-[#413b32] space-y-2">
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    className="flex w-full justify-start items-center gap-3 px-3 py-2.5 rounded text-xs text-red-400 hover:bg-red-950/20 hover:text-red-300 font-normal h-auto"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </aside>
            </div>
          )}

          {/* WORKSPACE AREA CONTAINER */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <div className="h-12 border-b border-[#413b32] bg-[#24211c]/80 backdrop-blur-md flex items-center px-4 justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden text-[#b2a899] hover:text-[#fdfbf7] h-8 w-8 p-0 hover:bg-neutral-900/40"
                  aria-label="Open sidebar menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                <div className="hidden sm:flex items-center gap-1.5 text-xxs font-mono text-[#9c8465]">
                  <span>Home</span>
                  <span>/</span>
                  <span className="text-[#fdfbf7] font-medium">{pageTitle}</span>
                </div>
              </div>

              <div className="hidden lg:flex w-80 relative items-center">
                <Search className="absolute left-3 h-3.5 w-3.5 text-[#776d5e] z-10" />
                <Input
                  type="text"
                  placeholder="Search template, item, or value..."
                  className="w-full text-xs pl-9 pr-4 py-1.5 border-[#524a3e] rounded bg-[#1c1916] text-[#f4f1eb] placeholder-[#776d5e] focus-visible:ring-1 focus-visible:ring-[#9c8465] text-left font-serif h-8 focus:border-[#9c8465]"
                />
              </div>
            </div>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#efebe4] text-[#292520]">
              <div className="max-w-7xl mx-auto h-full">
                {children}
              </div>
            </main>
          </div>

        </div>
      </div>

      {/* --- DEVELOPER ROLE SWITCHER STUDIO HUD --- */}
      {process.env.NODE_ENV === "development" && mounted && user && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#1c1916] border-2 border-[#9c8465] p-3 rounded-lg shadow-2xl flex flex-col gap-2 font-mono text-[10px] text-[#e2dacb] max-w-xs backdrop-blur-md opacity-90 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between border-b border-[#413b32] pb-1.5 font-bold uppercase text-[#9c8465]">
            <span>⚙️ Dev Role Studio</span>
            <span className="bg-[#3e3830] px-1 rounded text-white text-[9px]">Local</span>
          </div>
          
          <div className="space-y-1">
            <p className="text-[#a19787]">Active: <span className="text-emerald-400 lowercase">{user.email}</span></p>
            <p className="text-[#a19787]">Current Role: <span className="text-amber-400 font-bold uppercase">{user.role || "None"}</span></p>
          </div>

          <div className="grid grid-cols-3 gap-1 mt-1">
            {(["Admin", "Librarian", "Member"] as UserRole[]).map((targetRole) => (
              <button
                key={targetRole}
                onClick={() => {
                  setRole(targetRole);
                  router.refresh(); // Hot-reloads the template routing conditions smoothly
                }}
                className={cn(
                  "px-1.5 py-1 rounded border transition-all active:scale-95 font-bold",
                  user.role === targetRole
                    ? "bg-[#ecdcc5] text-[#29241e] border-white"
                    : "bg-[#2c2822] border-[#413b32] text-[#b2a899] hover:bg-[#322d26] hover:text-[#fdfbf7]"
                )}
              >
                {targetRole}
              </button>
            ))}
          </div>
          <p className="text-[8px] italic text-[#776d5e] text-center mt-0.5">Click roles to simulate sidebar access live.</p>
        </div>
      )}
    </TooltipProvider>
  );
}