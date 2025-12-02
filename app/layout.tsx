import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/Sidebar";


const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Cashcompass - Expense Tracker & Budget Manager",
  description: "Track your expenses and manage your budgets with CashCompass",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <Sidebar />
        {children}
         <Toaster 
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
