'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function HelpPage() {
  return (
    <main className="min-h-screen p-8 font-sans bg-[#f0f2f5]">
      <div className="max-w-4xl p-8 mx-auto bg-white shadow-lg rounded-xl">
        {/* Back Button */}
        <Link href="/" className="flex items-center text-gray-600 hover:text-[#2edc86] transition-colors mb-6">
          <ArrowLeft className="mr-2" size={20} />
          <span>Back to Home</span>
        </Link>
        
        <h1 className="mb-6 text-4xl font-extrabold text-[#181a1f]">Help & Support</h1>
        <p className="mb-8 leading-relaxed text-gray-700">
          Welcome to our Help Center. Find answers to common questions, troubleshoot issues, and get in touch with our support team.
        </p>

        {/* Quick Links */}
        <section className="mb-12">
          <h2 className="pb-2 mb-4 text-2xl font-semibold text-[#181a1f] border-b border-gray-300">
            Quick Links
          </h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <Link href="/faqs" className="text-[#2edc86] hover:underline">Frequently Asked Questions (FAQs)</Link>
            </li>
            <li>
              <Link href="/faqs" className="text-[#2edc86] hover:underline">How It Works</Link>
            </li>
            <li>
              <Link href="/terms" className="text-[#2edc86] hover:underline">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/privacy" className="text-[#2edc86] hover:underline">Privacy Policy</Link>
            </li>
          </ul>
        </section>

        {/* Contact Info */}
        <section>
          <h2 className="pb-2 mb-4 text-2xl font-semibold text-[#181a1f] border-b border-gray-300">
            Need More Help?
          </h2>
          <p className="mb-4 text-gray-700">
            If you can’t find what you’re looking for, feel free to reach out to our support team. We’re here to help!
          </p>
          <address className="space-y-2 not-italic text-gray-700">
            <div>WhatsApp: <a href="https://wa.me/256746838046" target="_blank" rel="noopener noreferrer" className="text-[#2edc86] hover:underline">Chat with us on WhatsApp</a></div>
          </address>
        </section>
      </div>
    </main>
  );
}