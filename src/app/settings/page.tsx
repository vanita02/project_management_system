"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import DashboardLayout from "@/components/DashboardLayout";
import { JiraButton } from "@/components/ui/JiraButton";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    taskReminders: true,
    weeklyDigest: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setMessage({ type: "success", text: "Settings saved successfully!" });
    setIsSaving(false);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportData = () => {
    // Export data functionality for managers
    const data = {
      user: user,
      exportDate: new Date().toISOString(),
      message: "This is a sample export of your data"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setMessage({ type: "success", text: "Data exported successfully!" });
  };

  const handleManageIntegrations = () => {
    // Manage third-party integrations functionality for managers
    setMessage({ type: "success", text: "Integration management panel opened!" });
  };

  const handleDeleteAllTasks = async () => {
    if (!confirm("Are you sure you want to delete all tasks? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch("/api/tasks/delete-all", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setMessage({ type: "success", text: "All tasks deleted successfully!" });
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.error || "Failed to delete tasks" });
      }
    } catch (error) {
      console.error("Delete all tasks error:", error);
      setMessage({ type: "error", text: "Failed to delete tasks" });
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone and will delete all your data.")) {
      return;
    }

    const finalConfirm = prompt("Type 'DELETE' to confirm account deletion:");
    if (finalConfirm !== "DELETE") {
      return;
    }

    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Account deleted successfully! Redirecting..." });
        // Clear local storage and redirect to login after a short delay
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/login";
        }, 2000);
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.error || "Failed to delete account" });
      }
    } catch (error) {
      console.error("Delete account error:", error);
      setMessage({ type: "error", text: "Failed to delete account" });
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Customize your experience</p>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg flex items-center gap-2 ${
          message.type === "success"
            ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
        }`}>
          {message.type === "success" ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 ${user?.role !== "MANAGER" ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h3>
            {user?.role !== "MANAGER" && (
              <span className="ml-auto text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">Manager Only</span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Theme</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Choose light or dark mode</p>
              </div>
              <button
                onClick={toggleTheme}
                disabled={user?.role !== "MANAGER"}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  theme === "dark" ? "bg-blue-600" : "bg-slate-300"
                } ${user?.role !== "MANAGER" ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform flex items-center justify-center ${
                    theme === "dark" ? "translate-x-7" : "translate-x-1"
                  }`}
                >
                  {theme === "dark" ? (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => theme === "dark" && toggleTheme()}
                disabled={user?.role !== "MANAGER"}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === "light"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700"
                } ${user?.role !== "MANAGER" ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <div className="w-full aspect-video bg-white rounded border border-slate-200 mb-3 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white text-center">Light</p>
              </button>
              <button
                onClick={() => theme === "light" && toggleTheme()}
                disabled={user?.role !== "MANAGER"}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === "dark"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700"
                } ${user?.role !== "MANAGER" ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <div className="w-full aspect-video bg-slate-800 rounded border border-slate-700 mb-3 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white text-center">Dark</p>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 ${user?.role !== "MANAGER" ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h3>
            {user?.role !== "MANAGER" && (
              <span className="ml-auto text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">Manager Only</span>
            )}
          </div>

          <div className="space-y-3">
            {[
              { key: "email" as const, label: "Email Notifications", description: "Receive updates via email" },
              { key: "push" as const, label: "Push Notifications", description: "Browser push notifications" },
              { key: "taskReminders" as const, label: "Task Reminders", description: "Get reminded about due tasks" },
              { key: "weeklyDigest" as const, label: "Weekly Digest", description: "Summary of your weekly activity" },
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{label}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(key)}
                  disabled={user?.role !== "MANAGER"}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    notifications[key] ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                  } ${user?.role !== "MANAGER" ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      notifications[key] ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Account</h3>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Export Data</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Download all your tasks and data</p>
                </div>
                <JiraButton
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  disabled={user?.role !== "MANAGER"}
                >
                  Export
                </JiraButton>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Connected Apps</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage third-party integrations</p>
                </div>
                <JiraButton
                  variant="outline"
                  size="sm"
                  onClick={handleManageIntegrations}
                  disabled={user?.role !== "MANAGER"}
                >
                  Manage
                </JiraButton>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900 rounded-lg p-6 ${user?.role !== "MANAGER" ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
            {user?.role !== "MANAGER" && (
              <span className="ml-auto text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">Manager Only</span>
            )}
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-700 dark:text-red-400">Delete All Tasks</p>
                  <p className="text-sm text-red-600/70 dark:text-red-400/70">Permanently delete all your tasks</p>
                </div>
                <JiraButton
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteAllTasks}
                  disabled={user?.role !== "MANAGER"}
                  className="bg-red-600 dark:bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700"
                >
                  Delete
                </JiraButton>
              </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-700 dark:text-red-400">Delete Account</p>
                  <p className="text-sm text-red-600/70 dark:text-red-400/70">Permanently delete your account</p>
                </div>
                <JiraButton
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteAccount}
                  className="bg-red-600 dark:bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700"
                >
                  Delete Account
                </JiraButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <JiraButton
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
          loading={isSaving}
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </JiraButton>
      </div>
    </DashboardLayout>
  );
}
