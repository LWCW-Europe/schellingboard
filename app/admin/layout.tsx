import { cookies } from "next/headers";
import Footer from "../footer";
import { CONSTS } from "@/utils/constants";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import { AdminLogoutButton } from "./logout-button";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAdmin = await isAdminCookieValid(
    cookieStore.get(ADMIN_COOKIE_NAME)?.value
  );

  return (
    <>
      <header className="bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-3 py-3 flex items-center justify-between">
          <span className="font-semibold">{CONSTS.TITLE} Admin</span>
          {isAdmin && <AdminLogoutButton />}
        </div>
      </header>
      <main className="flex-1 flex flex-col lg:px-24 p-3 lg:pb-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
