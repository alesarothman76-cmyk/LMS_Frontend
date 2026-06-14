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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  { name: "الرئيسية", href: "/", icon: Home, description: "لوحة التحكم الرئيسية" },
  {
    name: "قوالب الموارد",
    href: "/resourceTemplate",
    icon: FileCode,
    description: "إدارة وتصميم هياكل وقوالب الموارد البيانات",
  },
  {
    name: "المفردات (Vocabularies)",
    href: "/vocabularies",
    icon: Layers,
    description: "إدارة فضاءات الأسماء والبادئات والمصطلحات",
  },
  { name: "العناصر (Items)", href: "/items", icon: Database, description: "تصفح وإدارة عناصر البيانات الفردية" },
  {
    name: "مجموعات العناصر (Sets)",
    href: "/itemSets",
    icon: BookOpen,
    description: "تنظيم العناصر في مجموعات هيكلية متناسقة",
  },
  {
    name: "الوسائط (Media)",
    href: "/media",
    icon: ImageIcon,
    description: "إدارة الصور والملفات المرفقة بالموارد",
  },
  { name: "الإعدادات", href: "/settings", icon: Settings, description: "إعدادات النظام والخيارات العامة" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // State
//  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 // const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);


  
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

   // Initialize theme and sidebar collapse from localStorage
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const savedTheme = localStorage.getItem("theme");
  //     const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  //     const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
      
  //     setIsDarkMode(shouldBeDark);
  //     if (shouldBeDark) {
  //       document.documentElement.classList.add("dark");
  //     } else {
  //       document.documentElement.classList.remove("dark");
  //     }

  //     const savedCollapse = localStorage.getItem("sidebar-collapsed");
  //     if (savedCollapse === "true") {
  //       setIsSidebarCollapsed(true);
  //     }
  //   }
  // }, []);

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
  const pageTitle = currentItem ? currentItem.name : "نظام إدارة البيانات الوصفية (LMS)";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-50 flex font-sans" dir="rtl">
      
      {/* 1. Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-l border-slate-200 bg-white transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-900 relative z-30",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 border-b border-slate-100 dark:border-zinc-800 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Layers className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col text-right">
                <span className="font-bold text-sm leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                  نظام LMS
                </span>
                <span className="text-xxs text-slate-400 dark:text-zinc-500">
                  البيانات الوصفية
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -left-3 top-20 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm z-40 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          aria-label="Toggle Sidebar"
        >
          {isSidebarCollapsed ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-gradient-to-l from-blue-50 to-indigo-50/50 text-blue-600 dark:from-blue-950/40 dark:to-indigo-950/20 dark:text-blue-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
                )}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform group-hover:scale-105",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                  )}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute right-0 top-1/4 bottom-1/4 w-1 rounded-l bg-blue-600 dark:bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Help & Support / Docs link */}
        <div className="p-3 border-t border-slate-100 dark:border-zinc-800">
          <Link
            href="/docs"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
              isSidebarCollapsed && "justify-center"
            )}
          >
            <HelpCircle className="h-5 w-5 shrink-0 text-slate-400 dark:text-zinc-500" />
            {!isSidebarCollapsed && <span>مساعدة وتوثيق</span>}
          </Link>
        </div>
      </aside>

      {/* 2. Mobile Drawer / Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <aside className="relative flex flex-col w-64 max-w-xs bg-white dark:bg-zinc-900 h-full border-l border-slate-200 dark:border-zinc-800 z-50 animate-slide-in">
            <div className="h-16 flex items-center px-4 border-b border-slate-100 dark:border-zinc-800 justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white">
                  <Layers className="h-4.5 w-4.5" />
                </div>
                <span className="font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                  نظام LMS
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
               Open Menu
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-400 group-hover:text-slate-600 dark:text-zinc-500"
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
              <button
                onClick={toggleDarkMode}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-5 w-5 text-amber-500" />
                    <span>الوضع المضيء</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 text-indigo-500" />
                    <span>الوضع المظلم</span>
                  </>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
              >
                <LogOut className="h-5 w-5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Navbar */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center px-4 justify-between transition-colors dark:border-zinc-800 dark:bg-zinc-900/80">
          
          {/* Left section: Utilities & Actions */}
          <div className="flex items-center gap-3.5">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2.5 pr-1.5 pl-3 py-1.5 rounded-full border border-slate-150 bg-slate-50/50 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-850 transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  أ
                </div>
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">أمين المكتبة</span>
                  <span className="text-xxs text-slate-400 dark:text-zinc-500">librarian@lms.local</span>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute left-0 mt-2.5 w-56 bg-white border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 rounded-2xl shadow-xl py-2 z-50 text-right animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-zinc-800 sm:hidden">
                    <p className="font-bold text-xs text-slate-800 dark:text-zinc-200">أمين المكتبة</p>
                    <p className="text-xxs text-slate-400 dark:text-zinc-500">librarian@lms.local</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span>الملف الشخصي</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    <span>إعدادات الحساب</span>
                  </Link>
                  <div className="border-t border-slate-100 dark:border-zinc-800 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-800 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all relative"
                aria-label="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1 left-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute left-0 mt-2.5 w-80 bg-white border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 rounded-2xl shadow-xl py-3 z-50 text-right animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
                    <span className="font-bold text-sm">الإشعارات</span>
                    <button className="text-xxs text-blue-500 hover:underline">تحديد الكل كمقروء</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto px-2 py-1 space-y-1">
                    <div className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-xs">
                      <p className="font-semibold text-slate-700 dark:text-zinc-200">تم إنشاء قالب كتب دراسية بنجاح</p>
                      <span className="text-xxs text-slate-400 dark:text-zinc-500">منذ دقيقتين</span>
                    </div>
                    <div className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-xs">
                      <p className="font-semibold text-slate-700 dark:text-zinc-200">هناك عنصر جديد تم ربطه بمصطلح خارجي</p>
                      <span className="text-xxs text-slate-400 dark:text-zinc-500">منذ ساعة</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle (Desktop Only) */}
            <button
              onClick={toggleDarkMode}
              className="hidden md:flex p-2 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-800 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="h-4.5 w-4.5 text-amber-500" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-indigo-500" />
              )}
            </button>
          </div>

          {/* Middle section: Global Search Bar */}
          <div className="hidden lg:flex w-96 max-w-xs relative items-center">
            <Search className="absolute right-3.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="البحث عن قالب، عنصر، أو قيمة..."
              className="w-full text-xs pr-10 pl-4 py-2 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/80 dark:focus:bg-zinc-900 text-right"
            />
          </div>

          {/* Right section: Breadcrumbs / Title & Menu Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <div className="flex items-center gap-1.5 text-xxs text-slate-400 dark:text-zinc-500">
                <span>الرئيسية</span>
                <span>/</span>
                <span className="text-blue-500 dark:text-blue-400 font-medium">
                  {pageTitle}
                </span>
              </div>
              <h2 className="font-bold text-base text-slate-800 dark:text-zinc-100 leading-tight">
                {pageTitle}
              </h2>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
          </div>

        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
