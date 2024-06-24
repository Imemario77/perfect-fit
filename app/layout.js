import { Inter, Lato } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Perfect Fit",
  description:
    "Created by Ime Mario-Jeremiah Chukwuekwu an application to save you from the delima of looking for what to wear",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
