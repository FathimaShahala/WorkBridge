const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  loading = false,
  ...props
}) => {
  const base =
    "inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",

    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",

    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;