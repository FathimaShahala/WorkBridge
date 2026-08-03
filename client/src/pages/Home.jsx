import Navbar from "../components/layout/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />

      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-6">
        <div className="max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-extrabold text-slate-900">
            Smart Workforce Management
          </h1>

          <p className="mb-8 text-lg text-slate-600">
            WorkBridge connects workers, employers, labour officers,
            police, insurance providers, and administrators through one
            secure platform.
          </p>

          <button className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-700">
            Get Started
          </button>
        </div>
      </section>
    </>
  );
};

export default Home;