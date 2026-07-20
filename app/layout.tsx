import type { Metadata, Viewport } from "next";
import { Montserrat, Roboto, Fira_Code } from "next/font/google";
import "./globals.css";
import { getRepositories } from "@/db/container";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
});
const monteserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-monteserrat",
});
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontVars = [
  roboto.variable,
  monteserrat.variable,
  firaCode.variable,
].join(" ");

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getRepositories().settings.get();
  return {
    title: settings.title,
    description: settings.description,
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
