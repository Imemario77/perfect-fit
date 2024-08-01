import { Inter, Lato } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Perfect Fit",
  description:
    "Created by Ime Mario-Jeremiah Chukwuekwu an application to save you from the delima of looking for what to wear",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-bg">
          <Navbar />
          {children}
          <Footer />
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
