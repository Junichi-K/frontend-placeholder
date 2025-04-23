import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext"; // ⬅️ import the provider
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expenpad",
  description: "Think, write and upload, while being on the go!",
  icons: [
    {
      rel: "icon",
      url: "/logo (3).png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <Toaster position="bottom-center" />
        <UserProvider>
          {/* Remove the max-w wrapper for now */}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}


