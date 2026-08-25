import Footer from "../footer";
import { getRepositories } from "@/db/container";
import { isAdminRequest } from "@/utils/acting-admin";
import { AdminHeader } from "./admin-header";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = await isAdminRequest();
  const { title } = await getRepositories().settings.get();

  return (
    <>
      <AdminHeader title={title} isAdmin={isAdmin} />
      <main className="flex-1 flex flex-col px-3 lg:px-8 py-6 lg:pb-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
