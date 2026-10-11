
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  ShieldCheck,
  ClipboardList,
  UserCircle,
  Settings,
  Bell,
  X,
  Menu,
  Building2,
  Search,
  UserCheck,
  AlertTriangle,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logoutUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const role = user?.role;

  const navigation = {
    worker: [
      {
        name: "Dashboard",
        path: "/worker/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Find Jobs",
        path: "/worker/jobs",
        icon: Search,
      },
      {
        name: "My Applications",
        path: "/worker/applications",
        icon: ClipboardList,
      },
      {
        name: "Attendance",
        path: "/worker/attendance",
        icon: FileText,
      },
      {
        name: "Insurance",
        path: "/worker/insurance",
        icon: ShieldCheck,
      },
      {
        name: "Profile",
        path: "/worker/profile",
        icon: UserCircle,
      },
    ],

    employer: [
      {
        name: "Dashboard",
        path: "/employer/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Post Job",
        path: "/employer/jobs/create",
        icon: Briefcase,
      },
      {
        name: "My Jobs",
        path: "/employer/jobs",
        icon: ClipboardList,
      },
      {
        name: "Applications",
        path: "/employer/applications",
        icon: Users,
      },
      {
        name: "Workers",
        path: "/employer/workers",
        icon: UserCheck,
      },
      {
        name: "Profile",
        path: "/employer/profile",
        icon: UserCircle,
      },
    ],

    labourOfficer: [
      {
        name: "Dashboard",
        path: "/labour/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Workers",
        path: "/labour/workers",
        icon: Users,
      },
      {
        name: "Employers",
        path: "/labour/employers",
        icon: Building2,
      },
      {
        name: "Complaints",
        path: "/labour/complaints",
        icon: AlertTriangle,
      },
      {
        name: "Inspections",
        path: "/labour/inspections",
        icon: ClipboardList,
      },
      {
        name: "Profile",
        path: "/labour/profile",
        icon: UserCircle,
      },
    ],

    police: [
      {
        name: "Dashboard",
        path: "/police/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Complaints",
        path: "/police/complaints",
        icon: AlertTriangle,
      },
      {
        name: "Workers",
        path: "/police/workers",
        icon: Users,
      },
      {
        name: "Cases",
        path: "/police/cases",
        icon: FileText,
      },
      {
        name: "Verification",
        path: "/police/verification",
        icon: ShieldCheck,
      },
      {
        name: "Profile",
        path: "/police/profile",
        icon: UserCircle,
      },
    ],

    insurance: [
      {
        name: "Dashboard",
        path: "/insurance/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Policies",
        path: "/insurance/policies",
        icon: ShieldCheck,
      },
      {
        name: "Workers",
        path: "/insurance/workers",
        icon: Users,
      },
      {
        name: "Claims",
        path: "/insurance/claims",
        icon: FileText,
      },
      {
        name: "Reports",
        path: "/insurance/reports",
        icon: ClipboardList,
      },
      {
        name: "Profile",
        path: "/insurance/profile",
        icon: UserCircle,
      },
    ],

    admin: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Users",
        path: "/admin/users",
        icon: Users,
      },
      {
        name: "Workers",
        path: "/admin/workers",
        icon: UserCheck,
      },
      {
        name: "Employers",
        path: "/admin/employers",
        icon: Building2,
      },
      {
        name: "Jobs",
        path: "/admin/jobs",
        icon: Briefcase,
      },
      {
        name: "Complaints",
        path: "/admin/complaints",
        icon: AlertTriangle,
      },
      {
        name: "Reports",
        path: "/admin/reports",
        icon: ClipboardList,
      },
      {
        name: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
      {
        name: "Profile",
        path: "/admin/profile",
        icon: UserCircle,
      }
    ],
  };

  const menuItems = navigation[role] || [];

  const handleLogout = () => {
    setIsOpen(false);
    logoutUser();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-white p-2.5 text-slate-700 shadow-md lg:hidden"
        aria-label="Open dashboard menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              W
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                WorkBridge
              </h1>

              <p className="text-xs text-slate-400">
                Workforce Management
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close dashboard menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.fullName || "User"}
              </p>

              <p className="truncate text-xs capitalize text-slate-500">
                {role === "labourOfficer"
                  ? "Labour Officer"
                  : role || "User"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-slate-200 p-4">
          <NavLink
            to={`/${role}/notifications`}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <Bell size={19} />
            Notifications
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
