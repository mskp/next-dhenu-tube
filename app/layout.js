import "./globals.css";
import { Poppins } from "next/font/google";
import Header from "@/components/Header/Header";

const poppins = Poppins({ subsets: ["latin"], weight: "200" });

export const metadata = {
  title: 'DhenuTube - Download YouTube Videos',
  description: 'Seamless YouTube Video Downloads: Instantly save and enjoy videos offline with our efficient YouTube Video Downloader. Your gateway to convenient entertainment, anytime.',
  manifest: "/manifest.json"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
