
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ==============================
  // Handle Input Change
  // ==============================
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

  // ==============================
  // Validate Form
  // ==============================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==============================
  // Handle Login
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.data.success) {
  loginUser(response.data);

  toast.success(response.data.message);

  const role = response.data.user.role;

  switch (role) {
    case "worker":
      navigate("/worker/dashboard");
      break;

    case "employer":
      navigate("/employer/dashboard");
      break;

    case "labourOfficer":
      navigate("/labour/dashboard");
      break;

    case "police":
      navigate("/police/dashboard");
      break;

    case "insurance":
      navigate("/insurance/dashboard");
      break;

    case "admin":
      navigate("/admin/dashboard");
      break;

    default:
      navigate("/");
  }
}
    } catch (error) {
      console.error("Login Error:", error);

      const message =
        error.response?.data?.message ||
        "Login failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        {/* Back to Home */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome Back
          </h2>

          <p className="mt-2 text-slate-500">
            Sign in to continue to your WorkBridge account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Password */}
          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="absolute right-4 top-[38px] text-slate-400 transition hover:text-slate-700"
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

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login */}
          <Button
            type="submit"
            loading={loading}
          >
            Login
          </Button>
        </form>

        {/* Register */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;

