"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { UserRole } from "@/features/auth/types";
import {
  Home,
  FileCode,
  Layers,
  Database,
  BookOpen,
  Image as ImageIcon,
  Bell,
  ChevronLeft,
  ChevronRight,
  Search,
  HelpCircle,
  Users,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- SHADCN/UI DESIGN SYSTEM IMPORTS ---
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  allowedRoles?: UserRole[];
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
    allowedRoles: ["Admin", "Librarian"],
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
    allowedRoles: ["Admin", "Librarian"],
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
    description: "Configure system nodes and metadata preferences",
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, hasRole } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Hydration protection flags
  const [mounted, setMounted] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Sync mounting cycle and pull localStorage settings cleanly
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
      const savedSidebar = localStorage.getItem("sidebar-collapsed");
      if (savedSidebar) {
        setIsSidebarCollapsed(savedSidebar === "true");
      }
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const nextState = !prev;
      localStorage.setItem("sidebar-collapsed", String(nextState));
      return nextState;
    });
  };

  // Dynamic Role Filtering Matrix
  const visibleNavigationItems = navigationItems.filter((item) => {
    if (!item.allowedRoles) return true;
    if (!mounted) return false; // Hide protected links from server snapshot to match clean states
    return hasRole(item.allowedRoles);
  });

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
            <div className="flex items-center gap-5">
              {mounted && isAuthenticated && user && (
                <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-xxs tracking-wider text-[#c0b7a8]/70 hover:text-[#fdfbf7] p-0 h-auto font-mono bg-transparent hover:bg-transparent">
                      {user.fullName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#2c2822] border-[#524a3e] text-[#f4f1eb] font-serif shadow-xl">
                    <DropdownMenuLabel className="font-serif px-4 py-2 border-b border-[#413b32]">
                      <p className="font-bold text-xs text-[#fdfbf7] truncate">{user.fullName}</p>
                      <p className="text-xxs font-mono normal-case text-[#9c8465] font-normal truncate">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#413b32]" />
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Central Display Header */}
          <div className="relative z-10 my-4 text-left">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-wide text-[#fdfbf7] font-serif mb-2">
              Academic Digital Library Management System
            </h1>
            <p className="text-base italic font-serif text-[#c5bcae] max-w-4xl tracking-wide opacity-90">
              Explore new horizons with powerful and flexible design
            </p>
          </div>

          {/* Subtitle Navigation Row & Notifications Controls */}
          <div className="relative z-10 flex justify-between items-center text-xxs font-mono text-[#a19787] border-t border-[#443d34]/60 pt-3 mt-2">
            <div className="hidden lg:flex w-315 relative items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-[#776d5e] z-10" />
              <Input
                type="text"
                placeholder="Search template, item, or value..."
                className="w-full text-xs pl-9 pr-4 py-1.5 border-[#524a3e] rounded bg-[#1c1916] text-[#f4f1eb] placeholder-[#776d5e] focus-visible:ring-1 focus-visible:ring-[#9c8465] text-left font-serif h-8 focus:border-[#9c8465]"
              />
            </div>
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
            </div>
          </div>
        </header>

        {/* --- CONTENT CONTAINER WORKSPACE --- */}
        <div className="flex-1 flex flex-col md:flex-row bg-[#211e1a]">
          
          {/* LEFT SIDEBAR PANEL */}
          <aside
            className={cn(
              "hidden md:flex flex-col border-r border-[#413b32] bg-[#2c2822] transition-all duration-300 ease-in-out relative z-30 shrink-0",
              mounted && isSidebarCollapsed ? "w-20" : "w-64"
            )}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="absolute -right-3 top-16 bg-[#2c2822] border-[#524a3e] hover:bg-[#322d26] rounded-full h-6 w-6 p-0 text-[#b2a899] hover:text-[#fdfbf7] transition-all shadow-sm z-40"
              aria-label="Toggle Sidebar"
            >
              {/* Force clean layout icon matches on server load */}
              {!mounted || !isSidebarCollapsed ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
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
                      {/* Hide text structural nodes intelligently using styling triggers or mounting metrics */}
                      {(!isSidebarCollapsed || !mounted) && (
                        <span className="truncate text-xs tracking-wide animate-in fade-in duration-200">{item.name}</span>
                      )}
                    </Link>
                  );

                  // Provide Tooltips strictly post-mount to secure standard DOM tracking attributes
                  return mounted && isSidebarCollapsed ? (
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
              {mounted && isSidebarCollapsed ? (
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

          {/* WORKSPACE AREA CONTAINER */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#efebe4] text-[#292520]">
              <div className="max-w-7xl mx-auto h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}