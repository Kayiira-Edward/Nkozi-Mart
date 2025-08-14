// import "./globals.css";
// import "../fontawesome";
// import { GeistSans } from "geist/font/sans"; // Correct import for Geist Sans
// import { GeistMono } from "geist/font/mono"; // Correct import for Geist Mono
// import CartProvider from "./providers/CartProvider";
// import Footer from "./components/Footer";

// export const metadata = {
//   title: "Nkozi Mart - Marketplace",
//   description: "Buy and sell anything easily.",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
//         <CartProvider>
//           <main>{children}</main>
//         </CartProvider>
//         <Footer />
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import "../fontawesome";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import CartProvider from "./providers/CartProvider";
import Footer from "./components/Footer";

export const metadata = {
  title: "Nkozi Mart - Marketplace",
  description: "Buy and sell anything easily.",
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
