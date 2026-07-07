import { cookies } from "next/headers";
import Footer from "../footer";
import { CONSTS } from "@/utils/constants";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import { AdminHeader } from "./admin-header";

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
      <AdminHeader title={CONSTS.TITLE} isAdmin={isAdmin} />
      <main className="flex-1 flex flex-col px-3 lg:px-8 py-6 lg:pb-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
