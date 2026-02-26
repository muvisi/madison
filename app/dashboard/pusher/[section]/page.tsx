"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAccessToken } from "@/src/services/auth";
import toast from "react-hot-toast";

export default function PusherPage() {
  const router = useRouter();
  const params = useParams();
  const section = params?.section ?? "";

  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // ---------- Auth Guard ----------
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  // ---------- Section Rules ----------
  const isMemberBased =
    section === "Members" || section === "WaitingPeriods";

  const isSchemeBased =
    section === "Benefits" || section === "Categories";

  const inputLabel = isMemberBased ? "Member No" : "Scheme Code";

  const placeholder = isMemberBased
    ? "e.g. MAU/631706/00"
    : "e.g. 1349";

  // ---------- Push Handler ----------
  const handlePush = async () => {
    if (!inputValue) {
      toast.error(`Please enter ${inputLabel}`);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Pushing data...");

    try {
      const payload: any = {
        section,
        memberNo: inputValue, // same for all, backend decides logic
      };

      const response = await fetch(
        `${API_BASE}/api/trigger/trigger/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to push", {
          id: toastId,
        });
      } else {
        toast.success(
          data.message ||
            `Pushed ${inputValue} to ${section} successfully`,
          { id: toastId }
        );
        setInputValue("");
      }
    } catch (error) {
      toast.error("Network error", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center justify-start overflow-hidden pt-12 px-4">
      {/* 3D triangle background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-16 h-16 md:w-20 md:h-20 bg-blue-200/20 transform rotate-[45deg] animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Card Wrapper */}
      <div className="relative w-full max-w-sm md:max-w-md">
        {/* Overlay when submitting */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Card */}
        <div
          className={`bg-white shadow-xl rounded-2xl p-8 md:p-12 flex flex-col items-center gap-6 transition ${
            isSubmitting ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">
            Push: {section || "Unknown Section"}
          </h1>

          {(isMemberBased || isSchemeBased) && (
            <>
              <p className="text-gray-700 text-center mb-2">
                Enter the {inputLabel} to push:
              </p>

              <input
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 disabled:bg-gray-100"
              />

              <button
                onClick={handlePush}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? "Pushing..." : "Push"}
              </button>
            </>
          )}

          {!isMemberBased && !isSchemeBased && (
            <p className="text-gray-500 text-center">
              No specific action available for this section.
            </p>
          )}
        </div>
      </div>

      {/* Triangle float animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(45deg);
          }
          50% {
            transform: translateY(-10px) rotate(45deg);
          }
          100% {
            transform: translateY(0px) rotate(45deg);
          }
        }
        .animate-float {
          animation-name: float;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </div>
  );
}