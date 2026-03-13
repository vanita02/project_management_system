"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { Notification } from "@/types";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => void;
  markAsRead: (notificationIds: number[]) => void;
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "isRead">) => void;
  isLoading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("Fetched notifications:", data);
      if (response.ok) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationIds: number[]) => {
    if (!token) return;
    
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationIds }),
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notificationIds.includes(notification.id) 
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const addNotification = (newNotification: Omit<Notification, "id" | "createdAt" | "isRead">) => {
    const notification: Notification = {
      ...newNotification,
      id: Date.now(), // Temporary ID until we get real one from API
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    
    setNotifications(prev => [notification, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  // Set up polling for new notifications every 5 seconds (reduced from 30 for testing)
  useEffect(() => {
    if (!token) return;
    
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [token, fetchNotifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        addNotification,
        isLoading,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}
