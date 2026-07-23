"use client";

import { FaSpinner } from "react-icons/fa";

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({
  text = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <FaSpinner className="h-8 w-8 animate-spin text-blue-600" />

      <span className="mt-3 text-sm text-gray-600">
        {text}
      </span>
    </div>
  );
}