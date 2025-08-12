'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen p-8 font-sans bg-[#f0f2f5]">
      <div className="max-w-4xl p-6 mx-auto bg-white shadow-md rounded-xl">
        {/* Back Button */}
        <Link href="/" className="flex items-center text-gray-600 hover:text-[#2edc86] transition-colors mb-6">
          <ArrowLeft className="mr-2" size={20} />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-3xl font-bold text-[#181a1f] mb-4">Privacy Policy</h1>
        <p className="mb-6 leading-relaxed text-gray-700">
          This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our site. Your privacy is important to us.
        </p>
        
        {/* Placeholder Sections */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#181a1f] mb-2">1. What Personal Information We Collect</h2>
          <p className="leading-relaxed text-gray-700">
            When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the site, and information about how you interact with the site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#181a1f] mb-2">2. How We Use Your Personal Information</h2>
          <p className="leading-relaxed text-gray-700">
            We use the order information that we collect generally to fulfill any orders placed through the site (including arranging for shipping, and providing you with invoices and/or order confirmations).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#181a1f] mb-2">3. Sharing Your Personal Information</h2>
          <p className="leading-relaxed text-gray-700">
            We do not share your Personal Information with third parties. However, as our platform facilitates direct communication via WhatsApp, any information you share with sellers is subject to their own privacy practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#181a1f] mb-2">4. Your Rights</h2>
          <p className="leading-relaxed text-gray-700">
            If you are a Ugandan resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through our support channels.
          </p>
        </section>
        
      </div>
    </main>
  );
}
