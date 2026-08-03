import clsx from "clsx";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) => {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "bg-slate-200 hover:bg-slate-300 text-slate-900",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white",

    outline:
      "border border-slate-300 bg-white hover:bg-slate-100 text-slate-700",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "w-full sm:w-auto",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;