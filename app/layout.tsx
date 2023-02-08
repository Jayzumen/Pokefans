"use client";

import "./globals.css";
import { Poppins } from "@next/font/google";
import Navbar from "@/app/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  style: "normal",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${poppins.className} flex flex-col justify-center text-center text-white`}
      >
        <Navbar />
        <div className="bg-slate-900">{children}</div>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          // theme="dark"
        />
      </body>
    </html>
  );
}
