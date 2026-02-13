import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./lib/AuthContext";
import { ProductProvider } from "./lib/ProductContext";
import { CartProvider } from "./lib/CartContext";
import { OrdersProvider } from "./lib/OrdersContext";
import { CartDrawerProvider } from "./lib/CartDrawerContext";
import { WishlistProvider } from "./lib/WishlistContext";
import Header from "./components/Header";
import SideCartDrawer from "./components/SideCartDrawer";
import Footer from "./components/Footer";
import BackgroundWrapper from "./components/BackgroundWrapper";
import HiddenAdminLogin from "./components/HiddenAdminLogin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecommerce App",
  description: "Discover amazing categories at great prices",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="w-full overflow-x-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <OrdersProvider>
                <WishlistProvider>
                  <CartDrawerProvider>
                    <BackgroundWrapper>
                      <HiddenAdminLogin />
                      <Header />
                      {children}
                      <SideCartDrawer />
                      <Footer />
                    </BackgroundWrapper>
                  </CartDrawerProvider>
                </WishlistProvider>
              </OrdersProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
