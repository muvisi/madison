"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAccessToken } from "@/src/services/auth";
import toast from "react-hot-toast";

export default function PusherPage() {
  const router = useRouter();
  const params = useParams();

  const rawSection: string = Array.isArray(params?.section)
    ? params.section[0]
    : params?.section || "";

  const section = rawSection.toLowerCase();

  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  const memberSections = ["members", "waiting periods"];
  const schemeSections = [
    "corporate", 
    "benefits", 
    "categories", 
    "corp_groups", 
    "corp_anniversary",
    "copays",          
    "restrictions"     
  ];

  const isMemberBased = memberSections.includes(section);
  const isSchemeBased = schemeSections.includes(section);

  const inputLabel = isMemberBased
    ? "Member No"
    : isSchemeBased
    ? "Scheme Code (Numbers)"
    : "Identifier";

  const placeholder = isMemberBased ? "e.g. MAU/631706/00" : "e.g. 1349";

  const handlePush = async () => {
    if (!inputValue) {
      toast.error(`Please enter ${inputLabel}`);
      return;
    }

    if (isSchemeBased) {
      const isNumeric = /^\d+$/.test(inputValue);
      if (!isNumeric) {
        toast.error(`Numeric Scheme Code required`);
        return;
      }
    }

    setIsSubmitting(true);
    const toastId = toast.loading(`Pushing update...`);

    try {
      const payload: any = { section };
      if (isMemberBased) {
        payload.memberNo = inputValue;
      } else if (isSchemeBased) {
        payload.corp_id = inputValue; 
      }

      const response = await fetch(`${API_BASE}/api/trigger/trigger/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Update failed", { id: toastId });
      } else {
        toast.success(data.message || `Success`, { id: toastId });
        setInputValue("");
      }
    } catch (error) {
      toast.error("Network error", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="relative min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-start overflow-hidden pt-8 pb-12 px-4 sm:px-6">
      
      {/* Subtle Background Decor - Hidden on very small screens to save CPU */}
      <div className="absolute inset-0 -z-10 hidden xs:block">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-12 h-12 md:w-20 md:h-20 bg-blue-500/5 transform rotate-45 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-sm sm:max-w-md">
        {/* Card Container */}
        <div className={`relative bg-white shadow-xl rounded-[2rem] p-6 sm:p-10 flex flex-col items-center gap-6 border border-white transition-all duration-300 ${
            isSubmitting ? "opacity-90 scale-[0.98]" : "scale-100"
          }`}
        >
          {/* Internal Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center rounded-[2rem]">
               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
               <p className="text-blue-900 text-sm font-bold animate-pulse px-4 text-center">Syncing Remote Database...</p>
            </div>
          )}

          <div className="text-center space-y-1 w-full">
            <h1 className="text-2xl sm:text-3xl font-black text-blue-900 capitalize tracking-tight break-words">
              {rawSection}
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">Update Trigger</p>
          </div>

          {(isMemberBased || isSchemeBased) ? (
            <div className="w-full space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 flex justify-between">
                  <span>{inputLabel}</span>
                  {isSchemeBased && <span className="text-blue-400 text-[9px]">NUMBERS ONLY</span>}
                </label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePush()}
                  disabled={isSubmitting}
                  inputMode={isSchemeBased ? "numeric" : "text"}
                  className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-4 py-4 sm:py-5 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-500 transition-all text-base sm:text-lg font-semibold shadow-inner"
                />
              </div>

              <button
                onClick={handlePush}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold py-4 sm:py-5 px-6 rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.97] transition-all disabled:opacity-50 touch-manipulation"
              >
                {isSubmitting ? "Processing..." : "Push Update"}
              </button>
            </div>
          ) : (
            <div className="py-6 text-center bg-orange-50 rounded-2xl px-4 border border-orange-100 w-full">
               <p className="text-orange-700 text-xs sm:text-sm font-medium leading-relaxed">
                Section <strong>"{rawSection}"</strong> is not configured for remote sync.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <button 
          onClick={() => router.back()}
          className="mt-8 flex items-center justify-center gap-2 mx-auto text-gray-400 hover:text-blue-600 font-bold text-xs sm:text-sm transition-colors py-2 px-4 rounded-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 15l-3-3m0 0l3-3m-3 3h8" />
          </svg>
          Return to List
        </button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(45deg); }
          50% { transform: translateY(-20px) rotate(45deg); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        /* Prevents automatic zoom on iPhone input focus */
        @media screen and (max-width: 768px) {
          input { font-size: 16px !important; }
        }
      `}</style>
    </div>
  );
}