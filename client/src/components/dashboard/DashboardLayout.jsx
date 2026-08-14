import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-72">
        <DashboardNavbar />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;