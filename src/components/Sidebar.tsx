"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  color?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) return null;

  const navItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", color: "from-blue-500 to-blue-600", icon: iconDashboard },
    { name: "My Tasks", href: "/tasks", color: "from-slate-500 to-slate-600", icon: iconTasks },
    { name: "Kanban Board", href: "/kanban", color: "from-purple-500 to-purple-600", icon: iconKanban },
    { name: "Calendar", href: "/calendar", color: "from-green-500 to-green-600", icon: iconCalendar },
    { name: "Analytics", href: "/analytics", color: "from-orange-500 to-orange-600", icon: iconAnalytics },
  ];

  const managerItems: NavItem[] = [
    { name: "Team", href: "/team", color: "from-indigo-500 to-indigo-600", icon: iconTeam },
  ];

  const bottomItems: NavItem[] = [
    { name: "Profile", href: "/profile", icon: iconProfile },
    { name: "Settings", href: "/settings", icon: iconSettings },
  ];

  const allNavItems = user.role === "MANAGER" ? [...navItems, ...managerItems] : navItems;

  const renderNavItem = (item: NavItem, index: number) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 relative
          ${
            isActive
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          }`}
      >
        <span className={`w-5 h-5 flex items-center justify-center transition-colors ${
          isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
        }`}>
          {item.icon}
        </span>
        {!isCollapsed && (
          <span className="font-medium">{item.name}</span>
        )}
        {item.badge && !isCollapsed && (
          <span className="ml-auto bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-50 transition-all duration-300
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg text-slate-900 dark:text-white">TaskHub</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Project Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-hidden">
          {allNavItems.map(renderNavItem)}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            >
              <span className="w-5 h-5 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            <span className="w-5 h-5 flex items-center justify-center text-slate-400 dark:text-slate-500">
              {theme === "light" ? "" : ""}
            </span>
            {!isCollapsed && <span className="font-medium">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>}
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              
            </span>
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:block absolute top-4 -right-3 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 shadow-sm"
        >
          {isCollapsed ? "" : ""}
        </button>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm Logout</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Are you sure you want to logout?</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ICONS */
const iconDashboard = <span>📊</span>;
const iconTasks = <span>✓</span>;
const iconKanban = <span>📋</span>;
const iconCalendar = <span>📅</span>;
const iconAnalytics = <span>📈</span>;
const iconTeam = <span>👥</span>;
const iconProfile = <span>👤</span>;
const iconSettings = <span>⚙️</span>;