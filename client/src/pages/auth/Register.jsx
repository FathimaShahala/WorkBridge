import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Briefcase,
  ShieldCheck,
  Shield,
  HeartHandshake,
  UserCog,
} from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import toast from "react-hot-toast";

const roles = [
  {
    value: "worker",
    label: "Worker",
    icon: User,
  },
  {
    value: "employer",
    label: "Employer",
    icon: Briefcase,
  },
  {
    value: "labourOfficer",
    label: "Labour Officer",
    icon: ShieldCheck,
  },
  {
    value: "police",
    label: "Police",
    icon: Shield,
  },
  {
    value: "insurance",
    label: "Insurance",
    icon: HeartHandshake,
  },
  {
    value: "admin",
    label: "Administrator",
    icon: UserCog,
  },
];

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));

    setErrors((prev) => ({
      ...prev,
      role: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (!formData.role) {
      newErrors.role = "Please select your role";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    setLoading(true);

    const response = await api.post("/auth/register", {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      role: formData.role,
    });

    if (response.data.success) {
      toast.success(response.data.message);

      // Save authentication
      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Clear form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    }
  } catch (error) {
    console.error("Registration Error:", error);

    const message =
      error.response?.data?.message ||
      "Registration failed. Please try again.";

    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout>
      <div>
        {/* Back */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Heading */}
        <div className="mb-7">
          <h2 className="text-3xl font-bold text-slate-900">
            Create Account
          </h2>

          <p className="mt-2 text-slate-500">
            Join WorkBridge and get started today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            error={errors.fullName}
          />

          {/* Email */}
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
          />

          {/* Phone */}
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter 10-digit phone number"
            error={errors.phone}
          />

          {/* Role */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Select Your Role
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const selected = formData.role === role.value;

                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() =>
                      handleRoleChange(role.value)
                    }
                    className={`flex min-h-[88px] flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={22} />

                    <span className="mt-2 text-xs font-semibold sm:text-sm">
                      {role.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {errors.role && (
              <p className="mt-2 text-sm text-red-500">
                {errors.role}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              error={errors.password}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-700"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={
                showConfirmPassword ? "text" : "password"
              }
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-700"
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {/* Terms */}
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              required
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />

            <span>
              I agree to the{" "}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Terms & Conditions
              </button>{" "}
              and Privacy Policy.
            </span>
          </label>

          {/* Submit */}
          <Button
            type="submit"
            loading={loading}
          >
            Create Account
          </Button>
        </form>

        {/* Login */}
        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;