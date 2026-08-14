const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 outline-none transition
          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-300"
              : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          }`}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;