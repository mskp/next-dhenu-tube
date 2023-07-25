import "./globals.css";
import { Inter, Sono } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const sono = Sono({ subsets: ["latin"], weight: "800" });

export const metadata = {
  title: "DhenuTube: Youtube video downloader",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`} sono={sono}>{children}</body>
    </html>
  );
}
