import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: {
    default: "Ada",
    template: "%s · Ada",
  },
  description: "Para o dia a dia com ela.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${anton.variable} h-full antialiased`}>
      <body className="min-h-dvh bg-[#fafafa] font-sans text-black transition-colors duration-300 dark:bg-[#0a0a0a] dark:text-white">
        {children}
      </body>
    </html>
  );
}
