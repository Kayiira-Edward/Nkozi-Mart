import "./globals.css";
import "../fontawesome";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import CartProvider from "./providers/CartProvider";
import Footer from "./components/Footer";

export const metadata = {
  title: "Nkozi Mart - Marketplace",
  description: "Buy and sell anything easily.",
  // Add the manifest link here to enable Progressive Web App (PWA) features
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon added here */}
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <CartProvider>
          <main>{children}</main>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
