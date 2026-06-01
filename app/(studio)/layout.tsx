import type { Metadata } from "next";

// Separate root layout for the Sanity Studio. It intentionally imports NONE of
// the website's global SCSS, so the site's normalize/reset/theme can't leak in.
// Sanity Studio ships and scopes its own styles.

export const metadata: Metadata = {
  title: "Studio",
};

export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
