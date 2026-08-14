
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert size={32} />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          Access Denied
        </h1>

        <p className="mt-3 text-slate-500">
          You don't have permission to access this page.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
