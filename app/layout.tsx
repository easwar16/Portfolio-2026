import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Easwar",
  description:
    "Design-first developer with 2.5 years of experience building for the web.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Fontshare — Clash Display (headlines) + Satoshi (body) */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.history.scrollRestoration='manual';window.scrollTo(0,0);`,
          }}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}
