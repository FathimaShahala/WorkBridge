import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Clock,
  LogIn,
  LogOut,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

const WorkerAttendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ==========================================
  // Format Time
  // ==========================================
  const formatTime = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // Format Date
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // Fetch Attendance
  // ==========================================
  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const [todayResponse, historyResponse] =
        await Promise.all([
          api.get("/attendance/today"),
          api.get("/attendance/my"),
        ]);

      if (todayResponse.data.success) {
        setAttendance(
          todayResponse.data.attendance
        );
      }

      if (historyResponse.data.success) {
        setHistory(
          historyResponse.data.attendance || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch Attendance Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ==========================================
  // Check In
  // ==========================================
  const handleCheckIn = async () => {
    try {
      setActionLoading(true);

      const response = await api.post(
        "/attendance/check-in"
      );

      if (response.data.success) {
        toast.success(
          "Check-in successful."
        );

        await fetchAttendance();
      }
    } catch (error) {
      console.error(
        "Check In Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to check in."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // Check Out
  // ==========================================
  const handleCheckOut = async () => {
    try {
      setActionLoading(true);

      const response = await api.post(
        "/attendance/check-out"
      );

      if (response.data.success) {
        toast.success(
          "Check-out successful."
        );

        await fetchAttendance();
      }
    } catch (error) {
      console.error(
        "Check Out Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to check out."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading attendance...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">

        {/* ==================================
            Header
        ================================== */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Attendance
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track your daily check-in and
            check-out records.
          </p>
        </div>

        {/* ==================================
            Today's Attendance
        ================================== */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarCheck size={24} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Today's Attendance
              </h2>

              <p className="text-sm text-slate-500">
                {formatDate(new Date())}
              </p>
            </div>
          </div>

          {/* No Attendance */}
          {!attendance && (
            <div className="rounded-xl bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-500">
                You haven't checked in today.
              </p>

              <button
                type="button"
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogIn size={18} />

                {actionLoading
                  ? "Checking..."
                  : "Check In"}
              </button>
            </div>
          )}

          {/* Attendance Exists */}
          {attendance && (
            <>
              <div className="grid gap-4 md:grid-cols-3">

                {/* Status */}
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <CheckCircle
                      size={20}
                      className="text-emerald-500"
                    />

                    <span className="font-bold capitalize text-slate-900">
                      {attendance.status}
                    </span>
                  </div>
                </div>

                {/* Check In */}
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Check In
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <Clock
                      size={20}
                      className="text-blue-600"
                    />

                    <span className="font-bold text-slate-900">
                      {formatTime(
                        attendance.checkIn
                      )}
                    </span>
                  </div>
                </div>

                {/* Check Out */}
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Check Out
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <Clock
                      size={20}
                      className="text-orange-500"
                    />

                    <span className="font-bold text-slate-900">
                      {formatTime(
                        attendance.checkOut
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Check Out Button */}
              {!attendance.checkOut && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCheckOut}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogOut size={18} />

                    {actionLoading
                      ? "Checking..."
                      : "Check Out"}
                  </button>
                </div>
              )}

              {/* Completed */}
              {attendance.checkOut && (
                <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700">
                    <CheckCircle size={18} />
                    Today's attendance is complete.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ==================================
            Attendance History
        ================================== */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Attendance History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your previous attendance records.
            </p>
          </div>

          {history.length === 0 ? (
            <div className="p-10 text-center">
              <CalendarCheck
                size={40}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm text-slate-500">
                No attendance records found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Check In
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Check Out
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {formatDate(item.date)}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatTime(item.checkIn)}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatTime(item.checkOut)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-600">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default WorkerAttendance;