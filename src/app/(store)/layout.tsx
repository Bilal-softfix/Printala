import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <Navbar />
      <CartSidebar />
      <main id="main-content">{children}</main>
      <Footer />
    </MotionProvider>
  );
}
