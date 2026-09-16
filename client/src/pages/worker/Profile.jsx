import { useEffect, useRef, useState } from "react";
import {
  Edit,
  Mail,
  Phone,
  Save,
  User,
  Camera,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const WorkerProfile = () => {
  const { user, loginUser } = useAuth();

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    profileImage: "",
  });

  // ==========================================
  // Fetch Profile
  // ==========================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");

        if (response.data.success) {
          const profile = response.data.user;

          setFormData({
            fullName: profile.fullName || "",
            phone: profile.phone || "",
            profileImage: profile.profileImage || "",
          });
        }
      } catch (error) {
        console.error("Fetch Profile Error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // Input Change
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Upload Profile Image
  // ==========================================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Frontend validation
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");

      e.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      const data = new FormData();

      data.append("profileImage", file);

      const response = await api.post(
        "/users/profile/image",
        data,
         {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
      );

      if (response.data.success) {
        const updatedUser = response.data.user;

        setFormData((prev) => ({
          ...prev,
          profileImage:
            updatedUser.profileImage || "",
        }));

        // Update AuthContext + localStorage
        loginUser({
          token: localStorage.getItem("token"),
          user: updatedUser,
        });

        toast.success(
          "Profile image updated successfully."
        );
      }
    } catch (error) {
      console.error(
        "Profile Image Upload Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to upload profile image."
      );
    } finally {
      setUploadingImage(false);

      // Allow selecting same file again
      e.target.value = "";
    }
  };

  // ==========================================
  // Update Profile
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await api.put(
        "/users/profile",
        {
          fullName: formData.fullName,
          phone: formData.phone,
        }
      );

      if (response.data.success) {
        toast.success(
          "Profile updated successfully."
        );

        const updatedUser = response.data.user;

        setFormData((prev) => ({
          ...prev,
          fullName:
            updatedUser.fullName || "",
          phone: updatedUser.phone || "",
          profileImage:
            updatedUser.profileImage ||
            prev.profileImage,
        }));

        // Update AuthContext + localStorage
        loginUser({
          token: localStorage.getItem("token"),
          user: updatedUser,
        });

        setEditing(false);
      }
    } catch (error) {
      console.error(
        "Update Profile Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
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
              Loading profile...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // Profile Image URL
  // ==========================================
  const profileImageUrl = formData.profileImage
    ? formData.profileImage.startsWith("http")
      ? formData.profileImage
      : `http://localhost:5000${formData.profileImage}`
    : "";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Profile Header */}
          <div className="bg-slate-900 px-6 py-8">
            <div className="flex items-center gap-5">

              {/* Profile Image */}
              <div className="relative">

                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-blue-100">

                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User
                      size={36}
                      className="text-blue-600"
                    />
                  )}

                </div>

                {/* Camera Button */}
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={uploadingImage}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  title="Change profile picture"
                >
                  {uploadingImage ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Camera size={15} />
                  )}
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  {formData.fullName || "Worker"}
                </h2>

                <p className="mt-1 text-sm capitalize text-slate-300">
                  {user?.role || "worker"}
                </p>
              </div>

            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6"
          >
            <div className="mb-6 flex items-center justify-between">

              <h3 className="text-lg font-bold text-slate-900">
                Personal Information
              </h3>

              {!editing && (
                <button
                  type="button"
                  onClick={() =>
                    setEditing(true)
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-sm text-slate-500"
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Email cannot be changed here.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>
              </div>

            </div>

            {/* Actions */}
            {editing && (
              <div className="mt-8 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setEditing(false)
                  }
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>
            )}

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerProfile;