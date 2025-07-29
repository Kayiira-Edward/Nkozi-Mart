import SearchFilterBar from "./components/SearchFilterBar";
import Image from "next/image";

export default function Home() {
  return (
    <section>
    <SearchFilterBar />
  
    {/* Hero Section */}
    <section className="relative hidden min-h-screen py-16 overflow-hidden bg-white lg:block lg:py-24">
      <div className="container relative z-10 flex flex-col items-center justify-between px-4 mx-auto sm:px-6 lg:px-8 lg:flex-row">
        {/* Left Content Area */}
        <div className="mb-12 text-center lg:w-1/2 lg:text-left lg:mb-0">
          <h3 className="mb-6 text-5xl font-extrabold leading-tight text-gray-900 sm:text-6xl lg:text-7xl">
            <span className="block">Your Local Marketplace</span>
            <span className="block text-green-600">Delivered to Your WhatsApp</span>
          </h3>
          <p className="max-w-xl mx-auto mb-10 text-xl leading-relaxed text-gray-700 lg:mx-0">
            Discover local products, order conveniently via WhatsApp, and get hassle-free delivery.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <button className="px-8 py-4 font-semibold text-white transition duration-300 ease-in-out transform bg-green-600 rounded-lg shadow-lg hover:bg-green-700 hover:scale-105">
              Become a Seller
            </button>
            <button className="px-8 py-4 font-semibold text-green-600 transition duration-300 ease-in-out border-2 border-green-600 rounded-lg hover:bg-green-50 hover:scale-105">
              How It Works
            </button>
          </div>
        </div>
  
        {/* Right Visuals Area (Mockups/Cards) */}
        <div className="relative lg:w-1/2 flex justify-center items-center lg:pt-16 min-h-[500px] lg:min-h-[700px]">
          {/* Main Illustration/Image - Adjusted size for better fit */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/assets/images/wOrder.jpg"
              alt="Happy customer receiving delivery"
              width={600}
              height={600}
              quality={90}
              className="object-contain w-auto h-full max-h-[600px] lg:max-h-[700px] animate-fade-in rounded max-w-full"
              priority
            />
          </div>
  
          {/* Floating Cards - Adjusted Positioning */}
          {/* Bottom Middle Card (Order Confirmation) */}
          <div className="absolute bg-white p-6 rounded-xl shadow-xl border border-gray-100
              top-[50%] left-1/2 -translate-x-1/2
              lg:top-[55%] lg:left-1/2 lg:-translate-x-1/2 z-30 w-72 md:w-80 animate-slide-in-bottom">
            <div className="flex items-center mb-4 space-x-3">
              <div className="relative w-12 h-12 overflow-hidden bg-gray-200 rounded-full">
                <Image
                  src="/assets/images/one.jpg"
                  alt="Order steps"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">How to Order</p>
                <p className="text-sm text-gray-500">Follow these easy steps.</p>
              </div>
            </div>
  
            <ol className="mb-4 space-y-1 text-sm text-gray-700 list-decimal list-inside">
              <li>Select a category</li>
              <li>Choose your product</li>
              <li>Click “Add to Cart”</li>
              <li>Go to cart and confirm</li>
              <li>Send order via WhatsApp</li>
            </ol>
  
            <button className="w-full py-3 font-semibold text-green-800 transition duration-200 ease-in-out bg-green-100 rounded-lg hover:bg-green-200">
              Start Shopping
            </button>
          </div>
  
  
          {/* Right Notification Card (New Product/Vendor) */}
          <div className="absolute z-10 p-4 bg-white rounded-lg shadow-lg top-1/4 right-4 sm:top-1/4 sm:right-4 lg:top-1/4 lg:-right-20 lg:translate-x-0 w-60 md:w-64 animate-slide-in-right">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden bg-green-100 rounded-full">
                <span className="font-bold text-green-600">UG</span>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">Fresh Drop: Headphones & Gadgets!</p>
                <p className="text-xs text-gray-500">Just listed near campus 2 mins ago.</p>
              </div>
            </div>
          </div>
  
        </div>
      </div>
  
      {/* Trust Text below the main section */}
      <div className="container px-4 mx-auto mt-8 text-center sm:px-6 lg:px-8 lg:mt-24">
        <p className="text-lg text-gray-600">
          Trust the easiest way to support local businesses and get what you need, fast.
        </p>
      </div>
    </section>
  
    {/* Product Grid - cards coming here */}
    {/* If this is meant for actual product cards, you should create a new section here */}
  </section>
  );
}