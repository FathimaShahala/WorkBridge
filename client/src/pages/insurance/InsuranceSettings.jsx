
import React, { useEffect, useState } from "react";
import {
  Bell,
  Check,
  FileText,
  Lock,
  Save,
  Settings,
  Shield,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const InsuranceSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    claimNotifications: true,
    policyNotifications: true,
    systemNotifications: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const savedSettings = localStorage.getItem(
        "insuranceSettings"
      );

      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      await axios.get("/users/profile");
    } catch (error) {
      console.error("Fetch Insurance Settings Error:", error);

      const savedSettings = localStorage.getItem(
        "insuranceSettings"
      );

      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (field) => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const saveSettings = () => {
    try {
      setSaving(true);

      localStorage.setItem(
        "insuranceSettings",
        JSON.stringify(settings)
      );

      toast.success("Settings saved successfully.");
    } catch (error) {
      console.error("Save Insurance Settings Error:", error);
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const changePassword = async (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      await axios.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully.");
    } catch (error) {
      console.error("Change Password Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const notificationSettings = [
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description:
        "Receive important WorkBridge updates by email.",
      icon: Bell,
    },
    {
      key: "claimNotifications",
      title: "Claim Notifications",
      description:
        "Receive updates about insurance claims and claim activities.",
      icon: FileText,
    },
    {
      key: "policyNotifications",
      title: "Policy Notifications",
      description:
        "Receive updates related to insurance policies and workers.",
      icon: Shield,
    },
    {
      key: "systemNotifications",
      title: "System Notifications",
      description:
        "Receive important platform and account notifications.",
      icon: Settings,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50">
        <div className="text-center">
          <Settings
            size={34}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Settings size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                Insurance Settings
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your insurance account and notification preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
                <Bell size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">
                  Notification Preferences
                </h2>

                <p className="text-sm text-slate-500">
                  Choose which insurance notifications you want to receive.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {notificationSettings.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-500">
                      <Icon size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleSettingChange(item.key)
                    }
                    className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
                      settings[item.key]
                        ? "bg-blue-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        settings[item.key]
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end border-t border-slate-200 p-5">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>

        {/* Insurance Account */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-2.5 text-green-600">
                <Shield size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">
                  Insurance Account
                </h2>

                <p className="text-sm text-slate-500">
                  Basic information about your WorkBridge insurance account.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Account Type
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                Insurance Officer
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Account Security
              </p>

              <p className="mt-1 text-sm font-semibold text-green-600">
                Protected
              </p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-100 p-2.5 text-purple-600">
                <Lock size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">
                  Change Password
                </h2>

                <p className="text-sm text-slate-500">
                  Update your insurance account password.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={changePassword}
            className="space-y-5 p-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={changingPassword}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Lock size={17} />

                {changingPassword
                  ? "Changing..."
                  : "Change Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Security */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-100 p-2.5 text-orange-600">
                <User size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">
                  Account Security
                </h2>

                <p className="text-sm text-slate-500">
                  Your insurance account security status.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
              <Shield
                size={22}
                className="flex-shrink-0 text-green-600"
              />

              <div>
                <p className="text-sm font-semibold text-green-700">
                  Account Protected
                </p>

                <p className="mt-1 text-xs text-green-600">
                  Your account is protected by WorkBridge authentication.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    </DashboardLayout>
  );
};

export default InsuranceSettings;
