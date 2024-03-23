import "@/styles/globals.css";
import { Open_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";
import { siteConfig } from "@/config/site";
import { Analytics } from "@vercel/analytics/react";

const openSans = Open_Sans({
  subsets: ["latin"],
});

export const metadata = {
  title: "Event Log",
  description: "Created by Helton Quintans",
  manifest: `${siteConfig.url}/manifest.json`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <Providers>
          <Header />
          <main className="min-h-screen bg-custom-background bg-center bg-cover mx-auto max-w-7xl bg-[url('/images/home-bg.png')]" style={{backgroundImage: 'url("/images/home-bg.png")', backgroundSize: 'cover'}}>
          {/* // className="min-h-screen bg-white dark:bg-secondary mx-auto max-w-7xl" */}
            {children}
            <Analytics />
          </main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
