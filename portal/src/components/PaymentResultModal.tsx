import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface PaymentDetails {
  tx_Ref: string;
  amount: string;
  currency: string;
  date: string;
  status: "success" | "error";
  message: string;
}

const PaymentResultModal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [details, setDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const tx_Ref = searchParams.get("tx_ref");

  useEffect(() => {
    if (!tx_Ref) {
      setLoading(false);
      setDetails({
        tx_Ref: "N/A",
        amount: "N/A",
        currency: "N/A",
        date: new Date().toLocaleString(),
        status: "error",
        message: "No transaction reference provided.",
      });
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        const res = await fetch(`${apiUrl}/payment/verifyPayment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tx_ref: tx_Ref }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(String(errBody?.message || "Verification failed"));
        }

        const json = await res.json();
        const chapaData = (json && (json.data.data || json)) || {};

        const status = (chapaData.status || json.status || "error") === "success" ? "success" : "error";

        setDetails({
          tx_Ref: chapaData.tx_ref || chapaData.txRef || tx_Ref,
          amount: String(chapaData.amount ?? "N/A"),
          currency: chapaData.currency || "N/A",
          date: new Date().toLocaleString(),
          status,
          message: String(status === "success" ? "Thank you for your payment!" : chapaData.message || "Your payment could not be processed."),
        });
      } catch (error) {
  const msg = error instanceof Error ? error.message : String(error);
        setDetails({
          tx_Ref: tx_Ref || "N/A",
          amount: "N/A",
          currency: "N/A",
          date: new Date().toLocaleString(),
          status: "error",
          message: msg || "Could not verify your payment.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [tx_Ref]);

  if (loading) return <p className="text-center mt-10">Verifying payment...</p>;
  if (!details) return null;

  const isSuccess = details.status === "success";

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999]">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 text-black dark:text-white">
        <div className="flex flex-col items-center text-center">
          {isSuccess ? (
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
          )}

          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
            {isSuccess ? "Payment Successful" : "Payment Failed"}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{details.message}</p>

          <div className="w-full text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 text-black dark:text-white">
            <p>
              <span className="font-medium">Transaction Ref:</span>{" "}
              {details.tx_Ref}
            </p>
            <p>
              <span className="font-medium">Amount:</span> {details.amount}{" "}
              {details.currency}
            </p>
            <p>
              <span className="font-medium">Date:</span> {details.date}
            </p>
          </div>

          <a href="/" className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : modalContent;
};

export default PaymentResultModal;
// ...existing code...