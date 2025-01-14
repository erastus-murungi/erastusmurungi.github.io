import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../globals.css";

const primaryFont = Open_Sans({
  weight: "600",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pepi Pepi's playground ❤️",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${primaryFont.className} antialiased`}>{children}</div>
  );
}
