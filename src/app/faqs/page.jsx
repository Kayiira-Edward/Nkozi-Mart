'use client';
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const faqs = [
  {
    category: "How It Works",
    items: [
      {
        question: "How does the marketplace work?",
        answer: (
          <>
            Our marketplace is currently <strong>free and open to everyone</strong>—no account needed to browse or buy.  
            Buyers add products to their cart and place orders <strong>directly via WhatsApp</strong>, where they communicate and negotiate with sellers for a trustworthy experience.
            <br /><br />
            Sellers can register by clicking the <Link href="/auth?mode=register" className="text-[#2edc86] hover:underline">Become a Seller</Link> button, create their store, upload products, and manage them from a personalized dashboard.
          </>
        ),
      },
      {
        question: "Is there order tracking available?",
        answer: (
          <>
            Currently, order tracking is not available on the platform. All communication and negotiation happen directly between buyer and seller via WhatsApp to ensure transparency and trust.
          </>
        ),
      },
      {
        question: "How can I avoid scams?",
        answer: (
          <>
            While we work to maintain a safe marketplace, please stay alert:
            <ul className="mt-2 text-gray-700 list-disc list-inside">
              <li>Only communicate and negotiate through WhatsApp using the official contact details provided.</li>
              <li>Never share sensitive personal information or send money before confirming product details.</li>
              <li>Meet in public places if exchanging items in person.</li>
              <li>Report suspicious sellers or buyers via our <a href="https://wa.me/25646838046" className="text-[#2edc86] hover:underline">support page</a>.</li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    category: "Orders & Delivery",
    items: [
      {
        question: "How do shipping, delivery, and payment work?",
        answer: (
          <>
            Shipping, delivery, and payment terms are <strong>directly negotiated between the buyer and seller on WhatsApp</strong>.  
            We recommend opting for <strong>payment on delivery</strong> to reduce risks and build trust.  
            Always confirm all details with the seller before completing any payment.
          </>
        ),
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        question: "How do I create an account?",
        answer: (
          <>
            To create an account, click the <Link href="/auth?mode=register" className="text-[#2edc86] hover:underline">Sign Up</Link> button at the top right and fill out the registration form.
          </>
        ),
      },
      {
        question: "I forgot my password. How can I reset it?",
        answer: (
          <>
            Click on <Link href="/forgot-password" className="text-[#2edc86] hover:underline">Forgot Password</Link> on the login page, enter your registered email, and follow the instructions sent to your inbox.
          </>
        ),
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "Payment methods are decided between buyers and sellers on WhatsApp. We recommend payment on delivery to ensure security and trust.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Payments are handled directly between buyers and sellers outside this platform, so always follow safe practices during transactions.",
      },
    ],
  },
];

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-4 border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full font-medium text-left text-gray-900 focus:outline-none"
        aria-expanded={open}
        aria-controls={`${question.replace(/\s+/g, "-").toLowerCase()}-answer`}
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          id={`${question.replace(/\s+/g, "-").toLowerCase()}-answer`}
          className="mt-2 leading-relaxed text-gray-700"
        >
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQsPage() {
  return (
    <main className="min-h-screen p-8 font-sans bg-[#f0f2f5]">
      <div className="max-w-5xl p-8 mx-auto bg-white shadow-lg rounded-xl">
        {/* Back Button */}
        <Link href="/" className="flex items-center text-gray-600 hover:text-[#2edc86] transition-colors mb-6">
          <ArrowLeft className="mr-2" size={20} />
          <span>Back to Home</span>
        </Link>
        
        <h1 className="mb-6 text-4xl font-extrabold text-gray-900">
          Frequently Asked Questions
        </h1>
        <p className="max-w-xl mb-10 text-gray-600">
          Find answers to the most common questions about your account, orders, payments, and how our marketplace works.  
          Can't find what you're looking for? <a href="https://wa.me/25646838046" className="text-[#2edc86] hover:underline">Contact our support team</a>.
        </p>

        {faqs.map(({ category, items }) => (
          <section key={category} className="mb-10">
            <h2 className="pb-2 mb-4 text-2xl font-semibold text-gray-800 border-b border-gray-300">
              {category}
            </h2>
            <div>
              {items.map(({ question, answer }, idx) => (
                <FAQItem key={idx} question={question} answer={answer} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}