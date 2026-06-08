import type { Metadata } from "next";
import { Poppins } from "next/font/google";
// Reuse the website's global styles for this tools route group. Kept separate
// from the (site) layout so the contract tool doesn't inherit the nav / modal
// chrome, and separate from /studio so Studio styles stay isolated.
import "@/app/styles/globals.scss";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tools",
  robots: { index: false, follow: false },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} clearfix`}>{children}</body>
    </html>
  );
}
