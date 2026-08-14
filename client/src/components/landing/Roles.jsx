import { motion } from "framer-motion";
import {
  User,
  Building2,
  Shield,
  ShieldCheck,
  HeartHandshake,
  UserCog,
} from "lucide-react";

const roles = [
  {
    title: "Worker",
    icon: User,
    color: "bg-blue-100 text-blue-600",
    description:
      "Create your profile, apply for jobs, manage documents, and track applications.",
  },
  {
    title: "Employer",
    icon: Building2,
    color: "bg-emerald-100 text-emerald-600",
    description:
      "Post jobs, review applications, hire workers, and manage your workforce.",
  },
  {
    title: "Labour Officer",
    icon: ShieldCheck,
    color: "bg-purple-100 text-purple-600",
    description:
      "Verify worker registrations, monitor compliance, and approve requests.",
  },
  {
    title: "Police",
    icon: Shield,
    color: "bg-red-100 text-red-600",
    description:
      "Access verified worker information and support security verification.",
  },
  {
    title: "Insurance",
    icon: HeartHandshake,
    color: "bg-amber-100 text-amber-600",
    description:
      "Manage insurance policies, claims, and worker coverage.",
  },
  {
    title: "Administrator",
    icon: UserCog,
    color: "bg-slate-200 text-slate-700",
    description:
      "Manage users, monitor platform activity, and generate reports.",
  },
];

const Roles = () => {
  return (
    <section id="roles" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
            User Roles
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">
            Built for Every Stakeholder
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            Every user has a dedicated dashboard and tools designed for their
            responsibilities.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {roles.map((role, index) => {
            const Icon = role.icon;

            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-blue-200 hover:shadow-xl"
              >
                <div
                  className={`mb-6 inline-flex rounded-2xl p-4 ${role.color}`}
                >
                  <Icon size={32} />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  {role.title}
                </h3>

                <p className="leading-7 text-slate-600">
                  {role.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Roles;