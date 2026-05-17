"use client";

import { NotificationCard } from "./NotificationCard";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { useEffect, useState } from "react";
import { useNotifications } from "@/contexts/notifications";
import { Bell } from "lucide-react";

export default function Notifications() {
  const {
    newNotifications,
    notificationsData,
    markNotificationAsViewed,
  } = useNotifications();
  const [movingNotificationId, setMovingNotificationId] = useState(null);
  const [localNotifications, setLocalNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState("unread");

  useEffect(() => {
    if (Array.isArray(notificationsData)) {
      setLocalNotifications(notificationsData);
    }
  }, [notificationsData]);

  const handleMarkedAsViewed = (notificationId) => {
    setMovingNotificationId(notificationId);
    setTimeout(() => {
      setLocalNotifications((prev) =>
        prev.map((notification) =>
          notification?._id === notificationId
            ? { ...notification, isViewed: true }
            : notification
        )
      );
      markNotificationAsViewed?.(notificationId);
      setMovingNotificationId(null);
    }, 380);
  };

  const unreadNotifications = localNotifications.filter(
    (notification) => !notification?.isViewed
  );
  const readNotifications = localNotifications.filter(
    (notification) => notification?.isViewed
  );
  const activeNotifications =
    activeCategory === "unread" ? unreadNotifications : readNotifications;

  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Bell className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-500">Stay updated with your latest alerts and messages</p>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 space-y-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveCategory("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeCategory === "unread"
                  ? "bg-[#003667] text-white shadow-sm ring-1 ring-[#003667]/40"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              Unread ({unreadNotifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("read")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeCategory === "read"
                  ? "bg-[#003667] text-white shadow-sm ring-1 ring-[#003667]/40"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              Read ({readNotifications.length})
            </button>
          </div>
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 ring-1 ring-slate-200">
            {activeNotifications.length}
          </span>
        </div>

        <div className="max-h-[70vh] overflow-auto pr-1">
          {activeNotifications.length ? (
            activeNotifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                {...notification}
                isMovingToAll={
                  activeCategory === "unread" &&
                  movingNotificationId === notification._id
                }
                onMarkedAsViewed={handleMarkedAsViewed}
              />
            ))
          ) : (
            <div className="text-sm text-slate-500 py-10 text-center">
              {activeCategory === "unread"
                ? "No unread notifications."
                : "No read notifications yet."}
            </div>
          )}
        </div>
      </div>
    </MainDashboardContentSkeleton>
  );
}
