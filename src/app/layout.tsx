import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FixMate | Device & Appliance Repair",
  description: "Book verified technicians. Pay only after the job is done.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="fixmate">
      <body className={`${font.className} bg-base-100`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}