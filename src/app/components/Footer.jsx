
import Link from "next/link";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#f0f2f5] p-6 text-center text-gray-500 font-sans md:px-16 lg:px-32">
      <div className="container max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Brand */}
          <div>
  <h2 className="text-xl font-semibold text-[#181a1f]">ShopLink Uganda</h2>
  <p className="mt-1 text-sm text-gray-600">
    Discover. Connect. Order — all in one place. Bringing Uganda’s shops closer to you.
  </p>
</div>


          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link href="#" className="hover:text-[#2edc86]">Help</Link>
            <Link href="#" className="hover:text-[#2edc86]">How It Works</Link>
            <Link href="#" className="hover:text-[#2edc86]">FAQs</Link>
            <Link href="#" className="hover:text-[#2edc86]">Terms</Link>
            <Link href="#" className="hover:text-[#2edc86]">Privacy</Link>
          </div>

          {/* Contact */}
          <div className="flex justify-center gap-6 mt-4 text-xl">
            <a
              href="https://wa.me/2567XXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#2edc86]"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#2edc86]"
            >
              <FaInstagram />
            </a>
          </div>

          {/* Copyright */}
          <p className="mt-8 text-xs text-gray-400">
            © 2025 Hello! All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}