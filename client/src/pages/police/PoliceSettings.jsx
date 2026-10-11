
import { useState } from "react";
import {
  Settings,
  Bell,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Save,
  Mail,
  FileWarning,
  BadgeCheck,
  BriefcaseBusiness,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  complaintNotifications: true,
  caseNotifications: true,
  verificationNotifications: true,
  systemNotifications: true,
};

const PoliceSettings = () => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("policeSettings");

      return saved
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
        : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleToggle = (name) => {
    setSettings((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  const handleSaveSettings = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      localStorage.setItem(
        "policeSettings",
        JSON.stringify(settings)
      );

      toast.success("Notification preferences saved.");
    } catch (error) {
      console.error("Save Police Settings Error:", error);
      toast.error("Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    const { currentPassword, newPassword, confirmPassword } =
      passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await axios.put(
        "/auth/change-password",
        { currentPassword, newPassword }
      );

      if (response.data.success) {
        toast.success("Password changed successfully.");

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Police Password Change Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const notificationOptions = [
    {
      name: "emailNotifications",
      title: "Email Notifications",
      description: "Receive important platform updates by email.",
      icon: Mail,
    },
    {
      name: "complaintNotifications",
      title: "Complaint Notifications",
      description: "Get notified when complaints require police attention.",
      icon: FileWarning,
    },
    {
      name: "caseNotifications",
      title: "Case Notifications",
      description: "Receive updates about assigned and updated cases.",
      icon: BriefcaseBusiness,
    },
    {
      name: "verificationNotifications",
      title: "Verification Notifications",
      description: "Receive alerts about identity and document verification.",
      icon: BadgeCheck,
    },
    {
      name: "systemNotifications",
      title: "System Notifications",
      description: "Receive important WorkBridge system announcements.",
      icon: ShieldCheck,
    },
  ];

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700">
            <Settings size={27} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Police Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your notification preferences and account security.
            </p>
          </div>
        </div>

        {/* Notifications */}
        <form onSubmit={handleSaveSettings}>
          <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 p-5 sm:p-6">
              <div className="rounded-xl bg-red-50 p-2.5 text-red-700">
                <Bell size={21} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Notification Preferences
                </h2>

                <p className="text-sm text-slate-500">
                  Choose which notifications you want to receive.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {notificationOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <div
                    key={option.name}
                    className="flex items-center justify-between gap-4 p-5 sm:p-6"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-600">
                        <Icon size={18} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {option.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={settings[option.name]}
                      aria-label={option.title}
                      onClick={() => handleToggle(option.name)}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                        settings[option.name]
                          ? "bg-red-600"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                          settings[option.name]
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end border-t border-slate-100 p-5 sm:p-6">
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:opacity-60 sm:w-auto"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </section>
        </form>

        {/* Account Security */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 p-5 sm:p-6">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
              <Lock size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Account Security
              </h2>

              <p className="text-sm text-slate-500">
                Change your password to help keep your account secure.
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePasswordChange}
            className="space-y-5 p-5 sm:p-6"
          >
            {[
              {
                name: "currentPassword",
                label: "Current Password",
                key: "current",
              },
              {
                name: "newPassword",
                label: "New Password",
                key: "new",
              },
              {
                name: "confirmPassword",
                label: "Confirm New Password",
                key: "confirm",
              },
            ].map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {field.label}
                </label>

                <div className="relative">
                  <input
                    id={field.name}
                    type={
                      showPasswords[field.key]
                        ? "text"
                        : "password"
                    }
                    value={passwordData[field.name]}
                    onChange={(event) =>
                      setPasswordData((previous) => ({
                        ...previous,
                        [field.name]: event.target.value,
                      }))
                    }
                    autoComplete={
                      field.name === "currentPassword"
                        ? "current-password"
                        : "new-password"
                    }
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPasswords[field.key]
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPasswords((previous) => ({
                        ...previous,
                        [field.key]: !previous[field.key],
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPasswords[field.key] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={changingPassword}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
              >
                <Lock size={17} />
                {changingPassword
                  ? "Updating..."
                  : "Change Password"}
              </button>
            </div>
          </form>
        </section>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
          <ShieldCheck size={19} className="mt-0.5 shrink-0" />
          <p>
            Keep your account credentials confidential and sign out
            when using a shared computer.
          </p>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default PoliceSettings;

