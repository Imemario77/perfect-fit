import Navbar from "@/components/app/ui/navbar.jsx";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
