
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  RefreshCw,
  Search,
  X,
  UserPlus,
  Briefcase,
  FileText,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
  Settings,
  ExternalLink,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const EmployerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedNotification, setSelectedNotification] =
    useState(null);

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async (
    showRefreshLoader = false
  ) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get("/notifications");

      setNotifications(
        response.data?.notifications || []
      );
    } catch (error) {
      console.error(
        "Fetch Employer Notifications Error:",
        error
      );

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
  // UNREAD COUNT
  // ==========================================

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.isRead
    ).length;
  }, [notifications]);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
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
    });
  }, [notifications, search, filter]);

  // ==========================================
  // MARK ONE AS READ
  // ==========================================

  const handleMarkAsRead = async (
    notificationId
  ) => {
    try {
      await axios.put(
        `/notifications/${notificationId}/read`
      );

      const readAt = new Date().toISOString();

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
                readAt,
              }
            : notification
        )
      );

      setSelectedNotification((prev) =>
        prev?._id === notificationId
          ? {
              ...prev,
              isRead: true,
              readAt,
            }
          : prev
      );
    } catch (error) {
      console.error(
        "Mark Notification Read Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to mark notification as read."
      );
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      toast("All notifications are already read.");
      return;
    }

    try {
      await axios.put("/notifications/read-all");

      const readAt = new Date().toISOString();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
          readAt,
        }))
      );

      setSelectedNotification((prev) =>
        prev
          ? {
              ...prev,
              isRead: true,
              readAt,
            }
          : prev
      );

      toast.success(
        "All notifications marked as read."
      );
    } catch (error) {
      console.error(
        "Mark All Notifications Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to mark all notifications as read."
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (notificationId) => {
    try {
      await axios.delete(
        `/notifications/${notificationId}`
      );

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification._id !== notificationId
        )
      );

      if (
        selectedNotification?._id ===
        notificationId
      ) {
        setSelectedNotification(null);
      }

      toast.success(
        "Notification deleted successfully."
      );
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
  // OPEN NOTIFICATION
  // ==========================================

  const handleOpenNotification = async (
    notification
  ) => {
    setSelectedNotification(notification);

    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }
  };

  // ==========================================
  // ICON
  // ==========================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        return {
          icon: FileText,
          style: "bg-purple-50 text-purple-600",
        };

      case "job":
        return {
          icon: Briefcase,
          style: "bg-emerald-50 text-emerald-600",
        };

      case "registration":
        return {
          icon: UserPlus,
          style: "bg-blue-50 text-blue-600",
        };

      case "verification":
        return {
          icon: ShieldCheck,
          style: "bg-cyan-50 text-cyan-600",
        };

      case "complaint":
        return {
          icon: AlertTriangle,
          style: "bg-amber-50 text-amber-600",
        };

      case "case":
        return {
          icon: ClipboardList,
          style: "bg-red-50 text-red-600",
        };

      default:
        return {
          icon: Settings,
          style: "bg-slate-100 text-slate-600",
        };
    }
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (date) => {
    if (!date) return "";

    const difference =
      Date.now() - new Date(date).getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    if (minutes < 1) return "Just now";

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hr${
        hours > 1 ? "s" : ""
      } ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days} day${
        days > 1 ? "s" : ""
      } ago`;
    }

    return formatDate(date);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
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

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Bell size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Stay updated with your WorkBridge activities.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck size={17} />
              Mark all read
            </button>

            <button
              type="button"
              onClick={() =>
                fetchNotifications(true)
              }
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-70"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>
          </div>
        </div>

        {/* SUMMARY */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Notifications
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {notifications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
            <p className="text-sm text-blue-700">
              Unread
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-700">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
            <p className="text-sm text-emerald-700">
              Read
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-700">
              {notifications.length -
                unreadCount}
            </p>
          </div>
        </div>

        {/* SEARCH + FILTER */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search notifications..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                ["all", "All"],
                ["unread", "Unread"],
                ["read", "Read"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setFilter(value)
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    filter === value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}

        {filteredNotifications.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Bell size={28} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No notifications found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {search || filter !== "all"
                ? "Try changing your search or filter."
                : "You're all caught up."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(
              (notification) => {
                const config =
                  getNotificationIcon(
                    notification.type
                  );

                const Icon = config.icon;

                return (
                  <div
                    key={notification._id}
                    onClick={() =>
                      handleOpenNotification(
                        notification
                      )}
                    className={`group cursor-pointer rounded-2xl border p-4 shadow-sm transition sm:p-5 ${
                      notification.isRead
                        ? "border-slate-200 bg-white hover:shadow"
                        : "border-blue-200 bg-blue-50/60 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.style}`}
                      >
                        <Icon size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                                {notification.title}
                              </h3>

                              {!notification.isRead && (
                                <span className="h-2 w-2 rounded-full bg-blue-600" />
                              )}
                            </div>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {notification.message}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                            <Clock size={13} />
                            {getRelativeTime(
                              notification.createdAt
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {!notification.isRead && (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();

                                handleMarkAsRead(
                                  notification._id
                                );
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-blue-600 ring-1 ring-blue-100 hover:bg-blue-50"
                            >
                              <Check size={14} />
                              Mark as read
                            </button>
                          )}

                          {notification.link && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs text-slate-500 ring-1 ring-slate-200">
                              <ExternalLink size={13} />
                              View details
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();

                              handleDelete(
                                notification._id
                              );
                            }}
                            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

        {/* DETAILS MODAL */}

        {selectedNotification && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
            onClick={() =>
              setSelectedNotification(null)
            }
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div className="flex items-center gap-3">
                  {(() => {
                    const config =
                      getNotificationIcon(
                        selectedNotification.type
                      );

                    const Icon = config.icon;

                    return (
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.style}`}
                      >
                        <Icon size={19} />
                      </div>
                    );
                  })()}

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Notification Details
                    </h2>

                    <p className="text-xs text-slate-400">
                      {formatDate(
                        selectedNotification.createdAt
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedNotification(null)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedNotification.title}
                </h3>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {selectedNotification.message}
                </p>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Status
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        selectedNotification.isRead
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {selectedNotification.isRead
                        ? "Read"
                        : "Unread"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Type
                    </span>

                    <span className="font-medium capitalize text-slate-700">
                      {selectedNotification.type}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedNotification(null)
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>

                  {selectedNotification.link && (
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href =
                          selectedNotification.link;
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <ExternalLink size={16} />
                      Open
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default EmployerNotifications;
