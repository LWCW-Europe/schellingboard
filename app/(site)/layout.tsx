import NavBar from "./nav-bar";
import Footer from "../footer";
import { UserProvider } from "./context";
import { getRepositories } from "@/db/container";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, isAuthCookieValid } from "@/utils/auth";
import { verifiedCurrentUser } from "@/utils/acting-guest";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const authCookieValue = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = await isAuthCookieValid(authCookieValue);
  // verifiedCurrentUser: a guest cookie naming a protected guest without a
  // verified proof must not render the UI as that guest.
  const initialUser = isAuthenticated
    ? await verifiedCurrentUser(cookieStore)
    : null;
  const events = isAuthenticated ? await getRepositories().events.list() : [];
  const navItems = events.map((e) => ({
    name: e.name,
    href: `/${e.slug}`,
    icon: e.icon ?? null,
  }));
  // Global attendee list backs the header name selector, which is shown on
  // every page (guests are global, not per-event).
  const guests = isAuthenticated ? await getRepositories().guests.list() : [];
  const mapImageUrl = isAuthenticated
    ? (await getRepositories().settings.get()).mapImageUrl
    : "";

  return (
    <UserProvider initialUser={initialUser}>
      <NavBar
        navItems={navItems}
        guests={guests}
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
