import Sidebar from "../components/layout/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;