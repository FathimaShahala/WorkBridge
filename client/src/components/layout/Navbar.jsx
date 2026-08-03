import Logo from "./Logo";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        <div className="flex items-center gap-4">
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;