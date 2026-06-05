import type { Metadata } from "next";
import { Poppins } from "next/font/google";
// Website global styles (normalize, resets, theme) live ONLY in this route
// group's bundle, so they never leak into the Sanity Studio at /studio.
import "@/app/styles/globals.scss";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Photography",
  description: "Photography prototype",
  icons: {
    icon: "/shutter-favicon.svg",
  },
};

export default function SiteLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${poppins.variable} clearfix`}>
        {children}
        {modal}
      </body>
    </html>
  );
}
