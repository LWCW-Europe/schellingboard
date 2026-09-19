import Footer from "../footer";

// Outside the (site) group on purpose: nothing behind the site password can be
// shown yet, so the nav bar would render as an empty strip.
export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex-1 flex items-center justify-center px-4 py-12 lg:pb-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
