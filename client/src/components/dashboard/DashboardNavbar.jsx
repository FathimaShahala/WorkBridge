import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const DashboardNavbar = () => {
  const { user, logoutUser } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);

  const roleLabel = {
    worker: "Worker",
    employer: "Employer",
    labourOfficer: "Labour Officer",
    police: "Police",
    insurance: "Insurance",
    admin: "Administrator",
  };

  const role = roleLabel[user?.role] || "User";

  const profilePath = user?.role
    ? `/${user.role}/profile`
    : "/";

  // ==========================================
  // Profile Image URL
  // ==========================================
  const profileImageUrl = user?.profileImage
    ? user.profileImage.startsWith("http")
      ? user.profileImage
      : `http://localhost:5000${user.profileImage}`
    : "";

  const handleLogout = () => {
    setProfileOpen(false);
    logoutUser();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Welcome */}
        <div className="pl-12 lg:pl-0">
          <p className="text-sm text-slate-500">
            Welcome back,
          </p>

          <h2 className="max-w-[180px] truncate text-lg font-bold text-slate-900 sm:max-w-none">
            {user?.fullName || "User"}
          </h2>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Notifications */}
          <Link
            to={`/${user?.role}/notifications`}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
            aria-label="Notifications"
          >
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </Link>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* Profile */}
          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setProfileOpen((prev) => !prev)
              }
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
              aria-label="Open profile menu"
            >

              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-600">

                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={user?.fullName || "User"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span>
                    {user?.fullName
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </span>
                )}

              </div>

              {/* User Information */}
              <div className="hidden text-left md:block">
                <p className="max-w-32 truncate text-sm font-semibold text-slate-900">
                  {user?.fullName || "User"}
                </p>

                <p className="text-xs text-slate-500">
                  {role}
                </p>
              </div>

              <ChevronDown
                size={17}
                className={`hidden text-slate-400 transition-transform md:block ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <>
                {/* Click Outside */}
                <button
                  type="button"
                  aria-label="Close profile menu"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                  className="fixed inset-0 z-40 cursor-default"
                />

                <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                  {/* User Info */}
                  <div className="border-b border-slate-100 p-4">

                    {/* Dropdown Avatar */}
                    <div className="mb-3 flex items-center gap-3">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-600">

                        {profileImageUrl ? (
                          <img
                            src={profileImageUrl}
                            alt={
                              user?.fullName ||
                              "User"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>
                            {user?.fullName
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "U"}
                          </span>
                        )}

                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {user?.fullName ||
                            "User"}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {user?.email || ""}
                        </p>
                      </div>

                    </div>

                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                      {role}
                    </span>

                  </div>

                  {/* Links */}
                  <div className="p-2">

                    <Link
                      to={profilePath}
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <User size={18} />
                      My Profile
                    </Link>

                    <Link
                      to={`/${user?.role}/settings`}
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Settings size={18} />
                      Settings
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>

                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;