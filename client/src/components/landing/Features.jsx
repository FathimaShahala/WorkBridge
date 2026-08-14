import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  ShieldCheck,
  FileCheck,
  Bell,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Worker Management",
    description:
      "Register, verify, and manage migrant worker profiles securely.",
  },
  {
    icon: Briefcase,
    title: "Job Recruitment",
    description:
      "Employers can post jobs and recruit verified workers efficiently.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description:
      "JWT-based authentication with role-based access control.",
  },
  {
    icon: FileCheck,
    title: "Complaint Management",
    description:
      "Workers can submit complaints and track their resolution.",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description:
      "Receive updates about applications, approvals, and system alerts.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Monitor workforce, recruitment, and reports through visual dashboards.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Features
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">
            Everything You Need in One Platform
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            WorkBridge provides powerful tools for workers,
            employers, labour officers, police, insurance
            providers, and administrators.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-blue-200 hover:shadow-xl"
              >
                <div className="mb-6 inline-flex rounded-2xl bg-blue-100 p-4 transition group-hover:bg-blue-600">
                  <Icon
                    size={30}
                    className="text-blue-600 group-hover:text-white"
                  />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="leading-7 text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;