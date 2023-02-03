import Navbar from "@/app/Navbar";
import "./globals.css";
import { Poppins } from "@next/font/google";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
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
        <main className="p-4">
          <h1 className="my-4 text-4xl font-bold underline">Pokéfans</h1>
          {children}
        </main>
      </body>
    </html>
  );
}
