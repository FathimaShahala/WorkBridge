import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-lg">
        W
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-800">
          WorkBridge
        </h1>

        <p className="text-xs text-slate-500">
          Workforce Management
        </p>
      </div>
    </Link>
  );
};

export default Logo;