
import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Briefcase,
  CheckCircle,
  ClipboardList,
  Clock,
  FileText,
  Info,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  X,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const WorkerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedNotification, setSelectedNotification] =
    useState(null);

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
          "Failed to fetch notifications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark Notification Read Error:", error);
      toast.error("Failed to mark notification as read.");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: notification.readAt || new Date().toISOString(),
        }))
      );

      toast.success("All notifications marked as read.");
    } catch (error) {
      console.error("Mark All Notifications Error:", error);
      toast.error("Failed to mark all notifications as read.");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );

      if (selectedNotification?._id === id) {
        setSelectedNotification(null);
      }

      toast.success("Notification deleted.");
    } catch (error) {
      console.error("Delete Notification Error:", error);
      toast.error("Failed to delete notification.");
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    setSelectedNotification({
      ...notification,
      isRead: true,
    });
  };

  const openNotificationLink = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const getNotificationIcon = (type) => {
    const iconProps = {
      size: 20,
      strokeWidth: 2,
    };

    switch (type) {
      case "job":
        return <Briefcase {...iconProps} />;

      case "application":
        return <ClipboardList {...iconProps} />;

      case "complaint":
        return <AlertCircle {...iconProps} />;

      case "verification":
        return <ShieldCheck {...iconProps} />;

      case "registration":
        return <UserPlus {...iconProps} />;

      case "case":
        return <FileText {...iconProps} />;

      case "system":
      default:
        return <Info {...iconProps} />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "job":
        return "Job";

      case "application":
        return "Application";

      case "complaint":
        return "Complaint";

      case "verification":
        return "Verification";

      case "registration":
        return "Registration";

      case "case":
        return "Case";

      case "system":
      default:
        return "System";
    }
  };

  const getIconContainerClass = (type) => {
    switch (type) {
      case "job":
        return "bg-blue-100 text-blue-600";

      case "application":
        return "bg-green-100 text-green-600";

      case "complaint":
        return "bg-red-100 text-red-600";

      case "verification":
        return "bg-purple-100 text-purple-600";

      case "registration":
        return "bg-orange-100 text-orange-600";

      case "case":
        return "bg-yellow-100 text-yellow-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const formatTime = (date) => {
    if (!date) return "";

    const notificationDate = new Date(date);
    const now = new Date();

    const difference =
      Math.floor(
        (now.getTime() - notificationDate.getTime()) / 1000
      );

    if (difference < 60) {
      return "Just now";
    }

    if (difference < 3600) {
      return `${Math.floor(difference / 60)} min ago`;
    }

    if (difference < 86400) {
      return `${Math.floor(difference / 3600)} hr ago`;
    }

    if (difference < 604800) {
      return `${Math.floor(difference / 86400)} days ago`;
    }

    return notificationDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        notification.message
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !notification.isRead) ||
        (filter === "read" && notification.isRead);

      return matchesSearch && matchesFilter;
    });
  }, [notifications, search, filter]);

  const totalNotifications = notifications.length;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const readNotifications = notifications.filter(
    (notification) => notification.isRead
  ).length;

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Bell size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Stay updated with your WorkBridge activities.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => fetchNotifications(false)}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            {unreadNotifications > 0 && (
              <button
                onClick={markAllAsRead}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Notifications
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-800">
                  {totalNotifications}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Bell size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Unread
                </p>

                <h2 className="mt-1 text-2xl font-bold text-orange-600">
                  {unreadNotifications}
                </h2>
              </div>

              <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                <Clock size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Read
                </p>

                <h2 className="mt-1 text-2xl font-bold text-green-600">
                  {readNotifications}
                </h2>
              </div>

              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <CheckCircle size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {[
                ["all", "All"],
                ["unread", "Unread"],
                ["read", "Read"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
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

        {/* Notifications */}
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <RefreshCw
                size={32}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading notifications...
              </p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Bell size={30} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-800">
              No notifications found
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {search
                ? "Try changing your search keyword."
                : "You don't have any notifications at the moment."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 ${
                  notification.isRead
                    ? "border-slate-200"
                    : "border-blue-200 bg-blue-50/40"
                }`}
              >
                <div className="flex gap-3 sm:gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${getIconContainerClass(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`text-sm sm:text-base ${
                              notification.isRead
                                ? "font-semibold text-slate-700"
                                : "font-bold text-slate-900"
                            }`}
                          >
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

                      <span className="flex-shrink-0 text-xs text-slate-400">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {getTypeLabel(notification.type)}
                      </span>

                      <button
                        onClick={() =>
                          handleNotificationClick(notification)
                        }
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                      >
                        View details
                      </button>

                      {!notification.isRead && (
                        <button
                          onClick={() =>
                            markAsRead(notification._id)
                          }
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-green-600 transition hover:bg-green-50"
                        >
                          Mark as read
                        </button>
                      )}

                      {notification.link && (
                        <button
                          onClick={() =>
                            openNotificationLink(notification)
                          }
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-purple-600 transition hover:bg-purple-50"
                        >
                          Open
                        </button>
                      )}

                      <button
                        onClick={() =>
                          deleteNotification(notification._id)
                        }
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {selectedNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${getIconContainerClass(
                      selectedNotification.type
                    )}`}
                  >
                    {getNotificationIcon(
                      selectedNotification.type
                    )}
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-800">
                      Notification Details
                    </h2>

                    <p className="text-xs text-slate-400">
                      {formatTime(selectedNotification.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNotification(null)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {getTypeLabel(selectedNotification.type)}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {selectedNotification.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {selectedNotification.message}
                  </p>
                </div>

                {selectedNotification.link && (
                  <button
                    onClick={() =>
                      openNotificationLink(selectedNotification)
                    }
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Open Related Page
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default WorkerNotifications;
