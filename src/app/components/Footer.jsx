import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#f0f2f5] p-6 text-center text-gray-500 font-sans md:px-16 lg:px-32">
      <div className="container max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-semibold text-[#181a1f]">Nkozi Mart</h2>
            <p>Your campus essentials, delivered faster — and now, students can sell too!
               Connecting buyers and sellers around Uganda Martyrs University, Nkozi.</p>


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
            <a
              href="https://whatsapp.com/channel/0029VbBL5lUDTkJup86yPr3w" // Replace with actual WhatsApp business number
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#2edc86]"
            >
              <FaWhatsapp />
            </a>
            
            
            <a
              href="https://x.com/NkoziMart" // Replace with your real X (Twitter) handle
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#2edc86]"
            >
              <FaXTwitter />
            </a>
          </div>

          {/* Copyright */}
          <p className="mt-8 text-xs text-gray-400">
            © {new Date().getFullYear()} Nkozi Mart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
