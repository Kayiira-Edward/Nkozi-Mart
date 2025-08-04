import { Suspense } from "react";
import StoreContent from "./StoreContent";

export default function SellerStorePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        Loading store...
      </div>
    }>
      <StoreContent />
    </Suspense>
  );
}
