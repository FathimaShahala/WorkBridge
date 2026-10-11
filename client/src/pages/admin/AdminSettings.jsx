
import { useEffect, useState } from "react";
import {
  Settings,
  Save,
  ShieldCheck,
  Bell,
  Wrench,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    platformName: "WorkBridge",
    contactEmail: "",
    contactPhone: "",
    supportAddress: "",
    allowRegistration: true,
    requireVerification: true,
    emailNotifications: true,
    complaintNotifications: true,
    maintenanceMode: false,
  });

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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/admin/settings");

      if (response.data.success) {
        setSettings({
          platformName:
            response.data.settings.platformName || "WorkBridge",
          contactEmail:
            response.data.settings.contactEmail || "",
          contactPhone:
            response.data.settings.contactPhone || "",
          supportAddress:
            response.data.settings.supportAddress || "",
          allowRegistration:
            response.data.settings.allowRegistration ?? true,
          requireVerification:
            response.data.settings.requireVerification ?? true,
          emailNotifications:
            response.data.settings.emailNotifications ?? true,
          complaintNotifications:
            response.data.settings.complaintNotifications ?? true,
          maintenanceMode:
            response.data.settings.maintenanceMode ?? false,
        });
      }
    } catch (error) {
      console.error("Fetch Admin Settings Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await axios.put(
        "/admin/settings",
        settings
      );

      if (response.data.success) {
        setSettings((prev) => ({
          ...prev,
          ...response.data.settings,
        }));

        toast.success("Settings updated successfully.");
      }
    } catch (error) {
      console.error("Update Admin Settings Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await axios.put(
        "/auth/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }
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
      console.error("Change Password Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to change password."
      );
    }
  };

  const Toggle = ({ name, checked, onChange }) => (
    <button
      type="button"
      onClick={() =>
        onChange({
          target: {
            name,
            type: "checkbox",
            checked: !checked,
          },
        })
      }
      className={`relative h-6 w-11 rounded-full transition ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
      aria-label={`Toggle ${name}`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Settings size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Admin Settings
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage WorkBridge platform settings and your
                administrator account.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveSettings}>
          {/* Platform Information */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                  <Settings size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Platform Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Basic information about the WorkBridge platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Platform Name
                </label>

                <input
                  type="text"
                  name="platformName"
                  value={settings.platformName}
                  onChange={handleChange}
                  placeholder="WorkBridge"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Mail size={16} />
                  Contact Email
                </label>

                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  placeholder="support@workbridge.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Phone size={16} />
                  Contact Phone
                </label>

                <input
                  type="text"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MapPin size={16} />
                  Support Address
                </label>

                <input
                  type="text"
                  name="supportAddress"
                  value={settings.supportAddress}
                  onChange={handleChange}
                  placeholder="WorkBridge Support Office"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Platform Controls */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Platform Controls
                  </h2>

                  <p className="text-sm text-slate-500">
                    Control registration and verification behaviour.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Registration */}
              <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                <div>
                  <h3 className="font-medium text-slate-900">
                    Allow New Registration
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Allow new users to register on the platform.
                  </p>
                </div>

                <Toggle
                  name="allowRegistration"
                  checked={settings.allowRegistration}
                  onChange={handleChange}
                />
              </div>

              {/* Verification */}
              <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                <div>
                  <h3 className="font-medium text-slate-900">
                    Require User Verification
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Require user accounts to be verified before
                    full platform access.
                  </p>
                </div>

                <Toggle
                  name="requireVerification"
                  checked={settings.requireVerification}
                  onChange={handleChange}
                />
              </div>

              {/* Maintenance */}
              <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-900">
                      Maintenance Mode
                    </h3>

                    {settings.maintenanceMode && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Enable this when the platform is undergoing
                    maintenance.
                  </p>
                </div>

                <Toggle
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                  <Bell size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Notification Settings
                  </h2>

                  <p className="text-sm text-slate-500">
                    Manage platform notification preferences.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Email */}
              <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                <div>
                  <h3 className="font-medium text-slate-900">
                    Email Notifications
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Enable email notifications for platform events.
                  </p>
                </div>

                <Toggle
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                />
              </div>

              {/* Complaints */}
              <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                <div>
                  <h3 className="font-medium text-slate-900">
                    Complaint Notifications
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive notifications when new complaints are
                    submitted.
                  </p>
                </div>

                <Toggle
                  name="complaintNotifications"
                  checked={settings.complaintNotifications}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="mb-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Save size={18} />

              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>

        {/* Change Password */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
                <Lock size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Change Password
                </h2>

                <p className="text-sm text-slate-500">
                  Update your administrator account password.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handlePasswordChange}
            className="space-y-5 p-5 sm:p-6"
          >
            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Current Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPasswords.current
                      ? "text"
                      : "password"
                  }
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.current ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                New Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPasswords.new
                      ? "text"
                      : "password"
                  }
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      new: !prev.new,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.new ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPasswords.confirm
                      ? "text"
                      : "password"
                  }
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 sm:w-auto"
              >
                <Lock size={18} />
                Change Password
              </button>
            </div>
          </form>
        </div>

        {/* Maintenance Notice */}
        {settings.maintenanceMode && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
            <Wrench
              size={22}
              className="mt-0.5 shrink-0"
            />

            <div>
              <h3 className="font-semibold">
                Maintenance Mode is enabled
              </h3>

              <p className="mt-1 text-sm">
                The setting has been saved, but maintenance
                mode enforcement must be handled by backend
                middleware if you want to restrict platform
                access.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
