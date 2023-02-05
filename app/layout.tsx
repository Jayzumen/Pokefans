import Navbar from "@/app/Navbar";
import "./globals.css";
import { Poppins } from "@next/font/google";

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
        className={`${poppins.className} flex flex-col justify-center bg-black text-center text-white`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
