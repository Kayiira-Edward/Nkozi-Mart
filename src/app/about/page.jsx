'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen p-8 font-sans bg-[#f0f2f5]">
      <div className="max-w-4xl p-6 mx-auto bg-white shadow-md rounded-xl">
        {/* Back Button */}
        <Link href="/" className="flex items-center text-gray-600 hover:text-[#2edc86] transition-colors mb-6">
          <ArrowLeft className="mr-2" size={20} />
          <span>Back to Home</span>
        </Link>
        
        <h1 className="text-3xl font-bold text-[#181a1f] mb-4">About Us</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#181a1f] mb-2">Our Mission</h2>
          <p className="leading-relaxed text-gray-700">
            Our mission is to create a trusted and accessible online marketplace where
            everyone can easily buy and sell products directly within their community.  
            We empower sellers to grow their businesses and help buyers find what they need
            conveniently and securely.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#181a1f] mb-2">Our Vision</h2>
          <p className="leading-relaxed text-gray-700">
            We envision a future where local commerce thrives online — connecting buyers and
            sellers through simple, transparent communication and trustworthy transactions.
            By leveraging technology and direct negotiation via WhatsApp, we aim to build a
            marketplace that feels personal and secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#181a1f] mb-2">Our Story</h2>
          <p className="leading-relaxed text-gray-700">
            Founded with the goal to simplify online buying and selling, our platform bridges
            the gap between traditional local trade and modern e-commerce.  
            We started as a small community initiative and have grown into a platform that
            values trust, transparency, and the power of direct communication.
          </p>
        </section>
        
      </div>
    </main>
  );
}
