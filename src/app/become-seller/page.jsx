"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BecomeSellerLanding() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/become-seller/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50">
      <div className="flex flex-col items-center max-w-4xl mx-auto overflow-hidden bg-white shadow-2xl md:flex-row rounded-3xl">
        <div className="p-8 space-y-4 md:w-1/2">
          <h1 className="text-3xl font-bold leading-tight text-gray-800 md:text-4xl">
            Thank you for choosing <span className="text-green-600">ShopLink</span>
          </h1>
          <p className="text-gray-600">
            We're excited to help you grow your business. By joining us as a seller,
            you get access to a wide customer base, smart tools, and fast support —
            all designed to make your selling journey smooth and successful.
          </p>
          <p className="italic text-gray-500">
            "Build your dream brand. Let us handle the rest."
          </p>
          <button
            onClick={handleStart}
            className="px-6 py-3 mt-4 text-white transition bg-green-600 rounded-lg shadow hover:bg-green-700"
          >
            Start Registration
          </button>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/assets/images/two.jpg" // Corrected: removed '/public'
            alt="Become a Seller"
            width={500}
            height={400}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
