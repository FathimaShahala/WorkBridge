import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../layout/Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "How it Works", href: "#how-it-works" },
    // { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Roles", href: "#roles" },
      { name: "Testimonials", href: "#testimonials" },
{name:"CTA", href:"#cta"},
    { name: "Contact", href: "#footer" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-xl px-5 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 lg:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200 bg-white lg:hidden"
          >
            <div className="flex flex-col px-4 py-5">
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-3 text-slate-700 transition hover:bg-slate-100"
                >
                  {item.name}
                </a>
              ))}

              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="mt-4 rounded-xl border border-slate-300 px-4 py-3 text-center font-medium"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="mt-3 rounded-xl bg-blue-600 px-4 py-3 text-center font-medium text-white"
              >
                Register
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;