import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen p-8 font-sans bg-gray-50">
      <div className="max-w-4xl p-8 mx-auto bg-white shadow-lg rounded-xl">
        {/* Back Button */}
        <Link href="/" className="flex items-center text-gray-600 hover:text-[#2edc86] transition-colors mb-6">
          <ArrowLeft className="mr-2" size={20} />
          <span>Back to Home</span>
        </Link>
        <h1 className="mb-6 text-4xl font-extrabold text-gray-900">
          Terms & Conditions
        </h1>
        <p className="mb-8 leading-relaxed text-gray-700">
          Welcome to our platform. Please read these Terms & Conditions carefully as they
          govern your use of our services.
        </p>

        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-gray-800">1. Acceptance of Terms</h2>
          <p className="leading-relaxed text-gray-700">
            By accessing or using our platform, you agree to be bound by these terms. If you
            disagree with any part, please do not use our services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-gray-800">2. User Responsibilities</h2>
          <p className="leading-relaxed text-gray-700">
            Users must provide accurate information and are responsible for all activity under
            their account. Any misuse or violation of policies may result in suspension or termination.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-gray-800">3. Product Listings</h2>
          <p className="leading-relaxed text-gray-700">
            Sellers are solely responsible for the accuracy, legality, and quality of their
            product listings. Our platform is not liable for any disputes between buyers and sellers.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-gray-800">4. Payments & Transactions</h2>
          <p className="leading-relaxed text-gray-700">
            Payments and transaction terms are agreed upon directly between buyers and sellers.
            We recommend safe payment methods such as payment on delivery.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-gray-800">5. Limitation of Liability</h2>
          <p className="leading-relaxed text-gray-700">
            Our platform is a marketplace facilitator and is not responsible for damages or
            losses arising from buyer-seller transactions.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-gray-800">6. Changes to Terms</h2>
          <p className="leading-relaxed text-gray-700">
            We reserve the right to update or modify these terms at any time. Continued use
            after changes signifies acceptance of the new terms.
          </p>
        </section>

        
      </div>
    </main>
  );
}
