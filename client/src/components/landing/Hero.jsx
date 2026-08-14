import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, BriefcaseBusiness } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Glow */}
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl"></div>

      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Smart Workforce Management
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Connecting
            <span className="text-blue-600"> Workers </span>
            with
            <span className="text-indigo-600"> Opportunities</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            WorkBridge provides a secure platform where workers, employers,
            labour officers, police, insurance providers, and administrators
            collaborate through one intelligent system.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Get Started
              <ArrowRight className="ml-2" size={18} />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </Link>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <ShieldCheck className="mb-4 text-blue-600" size={36} />
            <h3 className="text-lg font-semibold text-slate-800">
              Secure Authentication
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Role-based access with JWT authentication keeps user data secure.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <BriefcaseBusiness className="mb-4 text-indigo-600" size={36} />
            <h3 className="text-lg font-semibold text-slate-800">
              Smart Recruitment
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Employers can recruit verified workers quickly and efficiently.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg sm:col-span-2">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <h2 className="text-3xl font-bold text-blue-600">6+</h2>
                <p className="mt-1 text-sm text-slate-600">User Roles</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-indigo-600">100%</h2>
                <p className="mt-1 text-sm text-slate-600">Digital Process</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-emerald-600">24/7</h2>
                <p className="mt-1 text-sm text-slate-600">Availability</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;