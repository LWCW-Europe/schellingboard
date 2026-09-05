import type { Metadata, Viewport } from "next";
import { Montserrat, Roboto, Fira_Code } from "next/font/google";
import { cookies } from "next/headers";
import clsx from "clsx";
import "./globals.css";
import { getRepositories } from "@/db/container";
import { THEME_COOKIE, normalizeTheme, themeClass } from "@/utils/theme";
import { ThemeProvider } from "./theme-context";

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
      // favicon.ico carries the heavier small-size cut of the mark; icon.svg
      // is the same drawing for browsers that prefer a scalable icon.
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-touch-icon.png",
    },
  };
}

// No themeColor here: it follows the theme, which can change under the
// reader's hands, so ThemeProvider renders the tag from its own state.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = normalizeTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <html lang="en" className={clsx(fontVars, themeClass(theme))}>
      <body className="font-monteserrat flex flex-col min-h-screen bg-surface text-fg">
        <ThemeProvider initial={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
