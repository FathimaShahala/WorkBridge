const Input = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        className={`
          w-full
          rounded-xl
          border
          border-slate-300
          px-4
          py-3
          outline-none
          transition
          focus:border-blue-600
          focus:ring-2
          focus:ring-blue-200
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;