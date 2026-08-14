import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Briefcase,
  Globe,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    title: "Registered Workers",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Building2,
    value: "500+",
    title: "Verified Employers",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Briefcase,
    value: "2,500+",
    title: "Jobs Posted",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Globe,
    value: "99.9%",
    title: "System Uptime",
    color: "from-orange-500 to-yellow-500",
  },
];

const Statistics = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24">
      {/* Background Blur */}
      <div className="absolute -top-24 left-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300">
            Our Impact
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
            Trusted Across Industries
          </h2>

          <p className="mt-4 text-lg text-slate-300">
            Empowering organizations and workers with a secure,
            transparent, and efficient workforce management platform.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.5,
                }}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
              >
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${stat.color}`}
                >
                  <Icon className="text-white" size={32} />
                </div>

                <h3 className="text-4xl font-extrabold text-white">
                  {stat.value}
                </h3>

                <p className="mt-3 text-slate-300">
                  {stat.title}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Statistics;