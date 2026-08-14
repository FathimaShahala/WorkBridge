import { motion } from "framer-motion";
import {
  UserPlus,
  BadgeCheck,
  Search,
  Send,
  Briefcase,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Create your WorkBridge account and complete your profile.",
  },
  {
    icon: BadgeCheck,
    title: "Verification",
    description: "Labour officers verify worker identity and documents.",
  },
  {
    icon: Search,
    title: "Find Jobs",
    description: "Browse jobs posted by verified employers.",
  },
  {
    icon: Send,
    title: "Apply",
    description: "Submit applications directly through the platform.",
  },
  {
    icon: Briefcase,
    title: "Employer Review",
    description: "Employers review applications and shortlist candidates.",
  },
  {
    icon: CheckCircle,
    title: "Get Hired",
    description: "Receive confirmation and start your new opportunity.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Process
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">
            How WorkBridge Works
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            A simple, secure workflow connecting workers, employers, and
            government departments.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                }}
                className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition"
              >
                <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </div>

                <div className="mb-6 inline-flex rounded-2xl bg-blue-100 p-4">
                  <Icon className="text-blue-600" size={30} />
                </div>

                <h3 className="mb-3 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="leading-7 text-slate-600">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;