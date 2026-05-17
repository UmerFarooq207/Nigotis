"use client";

import useUser from "@/hooks/useUser";
import { fetchCustom } from "@/lib/utils";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const NotificationsContext = createContext();

// Provider Component
export function NotificationProvider({ children }) {
  const [notificationsData, setNotificationsData] = useState(null);
  // Load persisted data from localStorage on initial render
  const { user } = useUser();
  
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notificationsData");
    if (notificationsData === null) {      
      fetchItems();
    } else if (storedNotifications !== "undefined") {
      setNotificationsData(JSON.parse(storedNotifications));
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      const response = await fetchCustom("/notification?type=all", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();

      if (data?.success) {
        setNotificationsData(data?.data);
        localStorage.setItem("notificationsData", JSON.stringify(data?.data));
      } else {
        console.log(data?.message);
        throw new Error(data?.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchNotifications = async () => {
    await fetchItems();
  };

  const markNotificationAsViewed = (notificationId) => {
    setNotificationsData((prev) => {
      if (!Array.isArray(prev)) return prev;
      const updated = prev.map((notification) =>
        notification?._id === notificationId
          ? { ...notification, isViewed: true }
          : notification
      );
      localStorage.setItem("notificationsData", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNotifications = () => {
    setNotificationsData(null);
    localStorage.removeItem("notificationsData");
  };

  const getNotificationsData = () => notificationsData;
  return (
    <NotificationsContext.Provider
      value={{
        notificationsData,
        newNotifications:
          notificationsData === null
            ? 0
            : notificationsData.filter((n) => !n.isViewed).length,
        fetchNotifications,
        markNotificationAsViewed,
        deleteNotifications,
        getNotificationsData,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// Hook for accessing NotificationsContext
export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must  must be used within a NotificationProvider"
    );
  }
  return context;
}
