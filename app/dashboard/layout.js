import Navbar from "@/components/app/ui/navbar.jsx";
import Sidebar from "@/components/app/ui/sidebar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="h-[100vh] w-full flex">
        <Sidebar />
        {children}
      </div>
    </>
  );
}
