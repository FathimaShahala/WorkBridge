
import React, { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Search,
  X,
  AlertTriangle,
  FileText,
  ShieldCheck,
  UserPlus,
  Info,
  RefreshCw,
  Clock,
  Briefcase,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const PoliceNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedNotification, setSelectedNotification] =
    useState(null);

  // ==========================================
  // Fetch Notifications
  // ==========================================

  const fetchNotifications = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await axios.get("/notifications");

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error("Fetch Notifications Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ==========================================
  // Mark One As Read
  // ==========================================

  const markAsRead = async (notification) => {
    if (notification.isRead) return;

    try {
      await axios.put(
        `/notifications/${notification._id}/read`
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : item
        )
      );
    } catch (error) {
      console.error("Mark Notification Read Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to mark notification as read."
      );
    }
  };

  // ==========================================
  // Mark All As Read
  // ==========================================

  const markAllAsRead = async () => {
    const unreadCount = notifications.filter(
      (notification) => !notification.isRead
    ).length;

    if (unreadCount === 0) {
      toast("All notifications are already read.");
      return;
    }

    try {
      await axios.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: new Date().toISOString(),
        }))
      );

      toast.success("All notifications marked as read.");
    } catch (error) {
      console.error(
        "Mark All Notifications Read Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to mark all notifications as read."
      );
    }
  };

  // ==========================================
  // Delete Notification
  // ==========================================

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.filter(
          (notification) => notification._id !== id
        )
      );

      if (selectedNotification?._id === id) {
        setSelectedNotification(null);
      }

      toast.success("Notification deleted.");
    } catch (error) {
      console.error(
        "Delete Notification Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete notification."
      );
    }
  };

  // ==========================================
  // Open Notification
  // ==========================================

  const openNotification = async (notification) => {
    await markAsRead(notification);

    setSelectedNotification({
      ...notification,
      isRead: true,
    });
  };

  // ==========================================
  // Notification Icons
  // ==========================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "case":
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <AlertTriangle size={21} />
          </div>
        );

      case "complaint":
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <FileText size={21} />
          </div>
        );

      case "verification":
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <ShieldCheck size={21} />
          </div>
        );

      case "application":
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <FileText size={21} />
          </div>
        );

      case "job":
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Briefcase size={21} />
          </div>
        );

      case "registration":
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <UserPlus size={21} />
          </div>
        );

      default:
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Info size={21} />
          </div>
        );
    }
  };

  // ==========================================
  // Relative Time
  // ==========================================

  const getRelativeTime = (date) => {
    if (!date) return "";

    const now = new Date();
    const created = new Date(date);

    const difference = now - created;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} ${
        minutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    if (hours < 24) {
      return `${hours} ${
        hours === 1 ? "hour" : "hours"
      } ago`;
    }

    if (days < 7) {
      return `${days} ${
        days === 1 ? "day" : "days"
      } ago`;
    }

    return created.toLocaleDateString();
  };

  // ==========================================
  // Filter Notifications
  // ==========================================

  const filteredNotifications = notifications.filter(
    (notification) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        notification.title
          ?.toLowerCase()
          .includes(searchText) ||
        notification.message
          ?.toLowerCase()
          .includes(searchText);

      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !notification.isRead) ||
        (filter === "read" && notification.isRead);

      return matchesSearch && matchesFilter;
    }
  );

  // ==========================================
  // Statistics
  // ==========================================

  const totalNotifications = notifications.length;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const readNotifications = notifications.filter(
    (notification) => notification.isRead
  ).length;

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-sm text-slate-500">
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ==========================================
            Header
        ========================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Bell size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Stay updated with police cases, complaints,
                verifications and system activities.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fetchNotifications(false)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
              Refresh
            </button>

            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
            >
              <CheckCheck size={17} />
              Mark all read
            </button>
          </div>
        </div>

        {/* ==========================================
            Statistics
        ========================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Notifications
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {totalNotifications}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Bell size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Unread
                </p>

                <p className="mt-2 text-2xl font-bold text-orange-600">
                  {unreadNotifications}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Clock size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Read
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  {readNotifications}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <Check size={21} />
              </div>
            </div>
          </div>

        </div>

        {/* ==========================================
            Search & Filters
        ========================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-md">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search notifications..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["all", "unread", "read"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium capitalize transition ${
                      filter === item
                        ? "bg-red-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

          </div>
        </div>

        {/* ==========================================
            Notification List
        ========================================== */}

        <div className="space-y-3">

          {filteredNotifications.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Bell size={30} />
              </div>

              <h3 className="text-lg font-semibold text-slate-700">
                No notifications found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Try changing your search."
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map(
              (notification) => (
                <div
                  key={notification._id}
                  onClick={() =>
                    openNotification(notification)
                  }
                  className={`group cursor-pointer rounded-2xl border p-4 shadow-sm transition hover:shadow-md sm:p-5 ${
                    notification.isRead
                      ? "border-slate-200 bg-white"
                      : "border-red-200 bg-red-50/60"
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">

                    <div className="shrink-0">
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">

                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-sm font-semibold sm:text-base ${
                              notification.isRead
                                ? "text-slate-700"
                                : "text-slate-900"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          {!notification.isRead && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-red-600" />
                          )}
                        </div>

                        <span className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                          <Clock size={13} />
                          {getRelativeTime(
                            notification.createdAt
                          )}
                        </span>

                      </div>

                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                        {notification.message}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">

                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                          {notification.type}
                        </span>

                        {!notification.isRead && (
                          <span className="rounded-lg bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                            Unread
                          </span>
                        )}

                      </div>

                    </div>

                    <div
                      className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >
                      {!notification.isRead && (
                        <button
                          onClick={() =>
                            markAsRead(notification)
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-green-50 hover:text-green-600"
                          title="Mark as read"
                        >
                          <Check size={18} />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          deleteNotification(
                            notification._id
                          )
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                  </div>
                </div>
              )
            )
          )}

        </div>
      </div>

      {/* ==========================================
          Details Modal
      ========================================== */}

      {selectedNotification && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedNotification(null)
          }
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-center justify-between border-b border-slate-200 p-5">

              <div className="flex items-center gap-3">
                {getNotificationIcon(
                  selectedNotification.type
                )}

                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Notification Details
                  </h2>

                  <p className="text-xs text-slate-400">
                    {getRelativeTime(
                      selectedNotification.createdAt
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedNotification(null)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-5 p-5">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Title
                </p>

                <h3 className="mt-1 text-lg font-semibold text-slate-800">
                  {selectedNotification.title}
                </h3>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Message
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {selectedNotification.message}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium capitalize text-slate-600">
                  Type: {selectedNotification.type}
                </span>

                <span className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
                  Read
                </span>
              </div>

              {selectedNotification.link && (
                <button
                  onClick={() => {
                    window.location.href =
                      selectedNotification.link;
                  }}
                  className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Open Related Page
                </button>
              )}

            </div>

            <div className="border-t border-slate-200 p-5">
              <button
                onClick={() =>
                  setSelectedNotification(null)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default PoliceNotifications;
