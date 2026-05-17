import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "../components/Navbar";
import NavbarOrNot from "../components/NavbarOrNot";
import FooterOrNot from "../components/FooterOrNot";
import { Toaster } from "@/components/ui/toaster";
import "@radix-ui/themes/styles.css";

import { Theme } from "@radix-ui/themes";
import ContextProvider from "@/contexts/index";

export const metadata = {
  title: "Nigotis Business Management",
  description: " Manage your business with ease",
};

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` ${font.className} antialiased `}>
          <ContextProvider>
            <Theme>
              <main className={` ${font.className} antialiased`}>
                <NavbarOrNot>
                  <Navbar />
                </NavbarOrNot>
                {children}
                <FooterOrNot />
                <Toaster />
              </main>
            </Theme>
          </ContextProvider>
      <Analytics />
      </body>
      <GoogleAnalytics gaId="G-1VE9BWK3HK" />
    </html>
  );
}
