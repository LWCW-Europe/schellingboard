import NavBar from "./nav-bar";
import Footer from "../footer";
import { UserProvider } from "./context";
import { getRepositories } from "@/db/container";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  isAuthCookieValid,
  isPasswordProtectionEnabledServer,
} from "@/utils/auth";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const passwordProtected = isPasswordProtectionEnabledServer();
  const cookieStore = await cookies();
  const authCookieValue = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = await isAuthCookieValid(authCookieValue);
  const initialUser = isAuthenticated
    ? (cookieStore.get("user")?.value ?? null)
    : null;
  const events = isAuthenticated ? await getRepositories().events.list() : [];
  const navItems = events.map((e) => ({
    name: e.name,
    href: `/${e.slug}`,
    icon: e.icon ?? null,
  }));
  const mapImageUrl = isAuthenticated
    ? (await getRepositories().settings.get()).mapImageUrl
    : "";

  return (
    <UserProvider initialUser={initialUser}>
      <NavBar
        navItems={navItems}
        showLogout={passwordProtected && isAuthenticated}
        showGuestsLink={isAuthenticated}
        mapImageUrl={mapImageUrl}
      />
      <main className="lg:px-24 sm:p-3 flex-1 pt-20 sm:pt-24 lg:pb-16">
        {children}
      </main>
      <Footer />
    </UserProvider>
  );
}
