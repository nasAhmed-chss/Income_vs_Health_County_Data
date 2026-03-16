import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "County Health & Socioeconomic Dashboard — CSE 564",
  description: "Interactive analysis of fused County Health Rankings data · ~540 counties · 20+ quantitative attributes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
