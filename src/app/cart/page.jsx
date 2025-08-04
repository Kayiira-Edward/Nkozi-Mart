// "use client";

// import { useCart } from "../providers/CartProvider";
// import Link from "next/link";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faShoppingCart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// export default function CartPage() {
//   const { cartItems, removeItem, updateQuantity } = useCart();

//   // Group cart items by seller
//   const groupedItems = cartItems.reduce((acc, item) => {
//     (acc[item.shop] = acc[item.shop] || []).push(item);
//     return acc;
//   }, {});

//   const totalCartValue = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   // Function to generate the WhatsApp order link for a seller
//   const generateWhatsAppLink = (shopItems, shopName) => {
//     const sellerPhoneNumber = "25677xxxxxxx"; // ⚠️ REPLACE THIS WITH THE SELLER'S ACTUAL PHONE NUMBER
//     let message = `Hello ${shopName}, I would like to order the following items:\n\n`;

//     let subtotal = 0;
//     shopItems.forEach((item) => {
//       const itemTotal = item.price * item.quantity;
//       subtotal += itemTotal;
//       message += `- ${item.name} (x${item.quantity}) - UGX ${itemTotal.toLocaleString()}\n`;
//     });

//     message += `\nTotal for this order: UGX ${subtotal.toLocaleString()}`;

//     // URL-encode the message to handle spaces and special characters
//     return `https://wa.me/${sellerPhoneNumber}?text=${encodeURIComponent(message)}`;
//   };

//   return (
//     <div className="min-h-screen p-4 bg-gray-50">
//       <div className="container mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="flex items-center text-3xl font-bold text-gray-900">
//             <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />
//             Your Cart
//           </h1>
//           <Link
//             href="/"
//             className="flex items-center text-sm font-semibold text-gray-700 transition-colors hover:text-green-600"
//           >
//             <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
//             Back to Shopping
//           </Link>
//         </div>
        
//         {Object.keys(groupedItems).length === 0 ? (
//           <div className="p-12 text-center bg-white rounded-lg shadow-md">
//             <p className="mb-4 text-xl font-medium text-gray-600">
//               Your cart is empty.
//             </p>
//             <Link
//               href="/"
//               className="inline-block px-6 py-3 text-white transition-colors bg-green-600 rounded-lg shadow-md hover:bg-green-700"
//             >
//               Start Shopping
//             </Link>
//           </div>
//         ) : (
//           <div>
//             {Object.keys(groupedItems).map((shopName) => {
//               const shopItems = groupedItems[shopName];
//               const shopSubtotal = shopItems.reduce(
//                 (total, item) => total + item.price * item.quantity,
//                 0
//               );
//               return (
//                 <div key={shopName} className="p-4 mb-8 bg-white rounded-lg shadow-md sm:p-6">
//                   <h2 className="pb-2 mb-4 text-xl font-bold text-gray-800 border-b sm:text-2xl">
//                     Seller: {shopName}
//                   </h2>
//                   <ul className="divide-y divide-gray-200">
//                     {shopItems.map((item) => (
//                       <li key={item.id} className="flex flex-col items-start justify-between py-4 md:flex-row md:items-center">
//                         <div className="flex items-start flex-grow mb-4 md:mb-0">
//                           <img
//                             src={item.img}
//                             alt={item.name}
//                             className="object-cover w-16 h-16 mr-4 rounded-lg"
//                           />
//                           <div>
//                             <h3 className="text-lg font-medium text-gray-900">
//                               {item.name}
//                             </h3>
//                             <p className="text-gray-600">
//                               UGX {item.price.toLocaleString()}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex flex-col items-end w-full space-y-2 md:flex-row md:items-center md:w-auto md:space-y-0 md:space-x-4">
//                           <div className="flex items-center space-x-2">
//                             <button
//                               onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                               className="flex items-center justify-center w-8 h-8 p-1 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
//                             >
//                               -
//                             </button>
//                             <span className="w-8 text-center">{item.quantity}</span>
//                             <button
//                               onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                               className="flex items-center justify-center w-8 h-8 p-1 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
//                             >
//                               +
//                             </button>
//                           </div>
//                           <p className="w-24 font-bold text-right text-gray-900">
//                             UGX {(item.price * item.quantity).toLocaleString()}
//                           </p>
//                           <button
//                             onClick={() => removeItem(item.id)}
//                             className="text-red-500 transition-colors hover:text-red-700"
//                             title="Remove Item"
//                           >
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               className="w-5 h-5"
//                               viewBox="0 0 20 20"
//                               fill="currentColor"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </button>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                   <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
//                     <p className="font-semibold text-gray-800">Subtotal for {shopName}:</p>
//                     <p className="font-bold text-green-600">UGX {shopSubtotal.toLocaleString()}</p>
//                   </div>
//                   <div className="mt-4 text-right">
//                     <a
//                       href={generateWhatsAppLink(shopItems, shopName)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-block px-6 py-3 text-white transition-colors bg-green-600 rounded-lg shadow-md hover:bg-green-700"
//                     >
//                       Order from {shopName}
//                     </a>
//                   </div>
//                 </div>
//               );
//             })}
//             <div className="flex items-center justify-between p-6 pt-6 mt-6 bg-white border-t-4 border-green-600 border-double rounded-lg shadow-md">
//               <h2 className="text-xl font-bold text-gray-900">Grand Total</h2>
//               <p className="text-xl font-bold text-green-600">
//                 UGX {totalCartValue.toLocaleString()}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useCart } from "../providers/CartProvider";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function CartPage() {
  const { cartItems, removeItem, updateQuantity } = useCart();

  // Group cart items by seller
  const groupedItems = cartItems.reduce((acc, item) => {
    (acc[item.shop] = acc[item.shop] || []).push(item);
    return acc;
  }, {});

  const totalCartValue = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Function to generate the WhatsApp order link for a seller
  const generateWhatsAppLink = (shopItems, shopName) => {
    const sellerPhoneNumber = "25677xxxxxxx"; // ⚠️ REPLACE THIS WITH THE SELLER'S ACTUAL PHONE NUMBER
    let message = `Hello ${shopName}, I would like to order the following items:\n\n`;

    let subtotal = 0;
    shopItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      message += `- ${item.name} (x${item.quantity}) - UGX ${itemTotal.toLocaleString()}\n`;
    });

    message += `\nTotal for this order: UGX ${subtotal.toLocaleString()}`;

    // URL-encode the message to handle spaces and special characters
    return `https://wa.me/${sellerPhoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen p-6 bg-[#f0f2f5] font-sans">
      <div className="container max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-[#181a1f] flex items-center">
            <div className="flex items-center justify-center w-10 h-10 mr-4 bg-white shadow-sm rounded-xl">
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </div>
          </Link>
          <h1 className="flex-grow text-center text-3xl font-semibold text-[#181a1f]">
            Your Cart
          </h1>
          <div className="flex items-center justify-center w-10 h-10 ml-4 bg-white shadow-sm rounded-xl">
            <FontAwesomeIcon icon={faShoppingCart} className="text-xl text-[#2edc86]" />
          </div>
        </div>
        
        {Object.keys(groupedItems).length === 0 ? (
          <div className="p-12 text-center bg-white shadow-md rounded-3xl">
            <p className="mb-4 text-xl font-medium text-[#4b5563]">
              Your cart is empty.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 text-white transition-all bg-[#2edc86] rounded-full shadow-lg hover:bg-[#4ade80]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div>
            {Object.keys(groupedItems).map((shopName) => {
              const shopItems = groupedItems[shopName];
              const shopSubtotal = shopItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              );
              return (
                <div key={shopName} className="p-6 mb-8 bg-white shadow-md rounded-3xl">
                  <h2 className="pb-3 mb-4 text-2xl font-bold text-[#181a1f] border-b border-gray-100">
                    Seller: {shopName}
                  </h2>
                  <ul className="divide-y divide-gray-100">
                    {shopItems.map((item) => (
                      <li key={item.id} className="flex flex-col items-start justify-between py-6 md:flex-row md:items-center">
                        <div className="flex items-start flex-grow mb-4 md:mb-0">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="object-cover w-20 h-20 mr-4 rounded-xl"
                          />
                          <div>
                            <h3 className="text-lg font-medium text-[#181a1f]">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              UGX {item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end w-full space-y-4 md:flex-row md:items-center md:w-auto md:space-y-0 md:space-x-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex items-center justify-center w-10 h-10 transition-colors bg-[#f1f5f9] text-gray-700 rounded-lg hover:bg-[#e2e8f0]"
                            >
                              -
                            </button>
                            <span className="w-10 text-center font-medium text-lg text-[#181a1f]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex items-center justify-center w-10 h-10 transition-colors bg-[#f1f5f9] text-gray-700 rounded-lg hover:bg-[#e2e8f0]"
                            >
                              +
                            </button>
                          </div>
                          <p className="w-24 font-bold text-right text-gray-900">
                            UGX {(item.price * item.quantity).toLocaleString()}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 transition-colors hover:text-red-700"
                            title="Remove Item"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                    <p className="font-semibold text-gray-800">Subtotal for {shopName}:</p>
                    <p className="font-bold text-[#2edc86]">UGX {shopSubtotal.toLocaleString()}</p>
                  </div>
                  <div className="mt-6 text-right">
                    <a
                      href={generateWhatsAppLink(shopItems, shopName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-4 text-white transition-all bg-[#2edc86] rounded-full shadow-lg hover:bg-[#4ade80]"
                    >
                      Order from {shopName}
                    </a>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between p-6 mt-6 bg-white shadow-md rounded-3xl">
              <h2 className="text-xl font-bold text-[#181a1f]">Grand Total</h2>
              <p className="text-xl font-bold text-[#2edc86]">
                UGX {totalCartValue.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}