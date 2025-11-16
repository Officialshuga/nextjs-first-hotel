"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref"); // Paystack uses trxref
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("=== PAYMENT SUCCESS PAGE ===");
    console.log("Reference from URL:", reference);
    console.log("Full URL:", window.location.href);
    console.log("All params:", Object.fromEntries(searchParams.entries()));

    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });

        const data = await response.json();
        console.log("Verification response:", data);

        if (data.success) {
          setStatus("success");
          setMessage("Payment verified successfully!");
          
          setTimeout(() => {
            router.push("/book-room");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.message || "Payment verification failed");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("Failed to verify payment");
      }
    };

    verifyPayment();
  }, [reference, router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {status === "verifying" && (
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-green-600">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">{message}</p>
          <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-red-600">Payment Failed</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      )}
    </div>
  );
}