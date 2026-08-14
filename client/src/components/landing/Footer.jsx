import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "#features" },
    { name: "How It Works", path: "#how-it-works" },
    { name: "Contact", path: "#contact" },
  ];

  const roles = [
    "Worker",
    "Employer",
    "Labour Officer",
    "Police",
    "Insurance",
    "Administrator",
  ];

  return (
    <footer
      id="footer"
      className="bg-slate-950 text-slate-300"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                W
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  WorkBridge
                </h2>

                <p className="text-sm text-slate-400">
                  Workforce Management
                </p>
              </div>
            </div>

            <p className="leading-7 text-slate-400">
              A smart platform connecting workers, employers,
              labour officers, police, insurance providers,
              and administrators through one secure ecosystem.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <div className="space-y-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block transition hover:text-blue-400"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Roles */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              User Roles
            </h3>

            <div className="space-y-3">
              {roles.map((role) => (
                <p
                  key={role}
                  className="cursor-pointer transition hover:text-blue-400"
                >
                  {role}
                </p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Contact
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-1 text-blue-400" />
                <span>support@workbridge.com</span>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-1 text-blue-400" />
                <span>+91 96459 xxxxx</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-blue-400" />
                <span>Kerala, India</span>
              </div>

              <div className="mt-6 flex gap-4">
               {[FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub].map(
  (Icon, index) => (
    <button
      key={index}
      className="rounded-xl bg-slate-800 p-3 transition hover:bg-blue-600"
    >
      <Icon size={18} />
    </button>
  )
)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-800 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-slate-500 md:flex-row">
            <p>
              © {new Date().getFullYear()} WorkBridge. All rights reserved.
            </p>

            <div className="flex gap-6">
              <button className="hover:text-blue-400">
                Privacy Policy
              </button>

              <button className="hover:text-blue-400">
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;