import "./globals.css";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import ToastUtils from "@/components/ToastUtils";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  style: "normal",
});

export const metadata: Metadata = {
  title: "PokeFans",
  description: "Pokéfans a Pokémon website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${poppins.className} flex flex-col justify-center text-center`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="">{children}</div>
          <ToastUtils />
        </ThemeProvider>
      </body>
    </html>
  );
}
