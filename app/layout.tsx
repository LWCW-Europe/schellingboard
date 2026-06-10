import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import { CONSTS } from "@/utils/constants";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
});
const monteserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-monteserrat",
});

const fontVars = [roboto.variable, monteserrat.variable].join(" ");

export const metadata: Metadata = {
  title: CONSTS.TITLE,
  description: CONSTS.DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVars}>
      <body className="font-monteserrat flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
