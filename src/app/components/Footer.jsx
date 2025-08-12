import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6"; // Using react-icons/fa6 for X icon

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
            <Link href="/help" className="hover:text-[#2edc86]">Help</Link>
            <Link href="/faqs" className="hover:text-[#2edc86]">FAQs</Link>
            <Link href="/terms" className="hover:text-[#2edc86]">Terms</Link>
            <Link href="/privacy" className="hover:text-[#2edc86]">Privacy</Link>
          </div>

          {/* Contact */}
          <div className="flex justify-center gap-6 mt-4 text-xl">
            {/* WhatsApp link updated with your number */}
            <a
              href="https://wa.me/25646838046"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#2edc86]"
            >
              <FaWhatsapp />
            </a>
            {/* Facebook link added */}
            <a
              href="https://facebook.com/yourprofile" // Replace 'yourprofile' with your Facebook page link
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#2edc86]"
            >
              <FaFacebook />
            </a>
            {/* Instagram link */}
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#2edc86]"
            >
              <FaInstagram />
            </a>
            {/* X (Twitter) link added */}
            <a
              href="https://x.com/yourprofile" // Replace 'yourprofile' with your X username
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#2edc86]"
            >
              <FaXTwitter />
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