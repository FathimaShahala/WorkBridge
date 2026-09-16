import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Settings,
  User,
  CalendarCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/worker/dashboard",
    },
    {
      name: "Jobs",
      icon: Briefcase,
      path: "/worker/jobs",
    },
    {
      name: "My Applications",
      icon: FileText,
      path: "/worker/applications",
    },
    {
      name: "Attendance",
      icon: CalendarCheck,
      path: "/worker/attendance",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/worker/settings",
    },
  ];

  const profileImageUrl = user?.profileImage
    ? user.profileImage.startsWith("http")
      ? user.profileImage
      : `http://localhost:5000${user.profileImage}`
    : "";

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="border-b p-6">
        <h2 className="text-xl font-bold text-blue-600">
          WorkBridge
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-4">
        <NavLink
          to="/worker/profile"
          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100"
        >
          {/* Profile Image */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={user?.fullName || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <User
                size={22}
                className="text-blue-600"
              />
            )}
          </div>

          {/* User Details */}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {user?.fullName || "Worker"}
            </p>

            <p className="truncate text-xs capitalize text-slate-500">
              {user?.role || "worker"}
            </p>
          </div>
        </NavLink>
      </div>

    </aside>
  );
};

export default Sidebar;