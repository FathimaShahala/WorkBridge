import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, UserPlus } from "lucide-react";

const CTA = () => {
  return (
    <section id="cta" className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900"></div>

      {/* Decorative Blur */}
      <div className="absolute -top-16 left-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
      <div className="absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
      >
        <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-blue-100">
          Get Started Today
        </span>

        <h2 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
          Ready to Transform Workforce Management?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
          Join WorkBridge to connect workers, employers, labour officers,
          police, insurance providers, and administrators through one secure,
          intelligent platform.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-4 text-lg font-semibold text-blue-700 shadow-lg transition hover:scale-105"
          >
            <UserPlus className="mr-2" size={20} />
            Create Account
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-7 py-4 text-lg font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Login
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;