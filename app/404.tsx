"use client";

import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* SVG Illustration */}
      <div className="w-64 h-64 mb-6">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Skeleton body */}
          <circle cx="100" cy="40" r="15" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" /> {/* head */}
          <line x1="100" y1="55" x2="100" y2="130" stroke="#9ca3af" strokeWidth="4" /> {/* torso */}
          <line x1="100" y1="60" x2="70" y2="100" stroke="#9ca3af" strokeWidth="3" /> {/* left arm */}
          <line x1="100" y1="60" x2="130" y2="100" stroke="#9ca3af" strokeWidth="3" /> {/* right arm */}
          <line x1="100" y1="130" x2="80" y2="170" stroke="#9ca3af" strokeWidth="3" /> {/* left leg */}
          <line x1="100" y1="130" x2="120" y2="170" stroke="#9ca3af" strokeWidth="3" /> {/* right leg */}

          {/* Big pencil in right hand */}
          <line x1="130" y1="100" x2="160" y2="70" stroke="#facc15" strokeWidth="6" /> {/* pencil body */}
          <polygon points="160,70 155,65 165,65" fill="#ef4444" /> {/* pencil tip */}
          <rect x="158" y="68" width="4" height="6" fill="#f3f4f6" /> {/* pencil eraser */}
        </svg>
      </div>

      {/* Text */}
      <h1 className="text-5xl font-bold text-gray-700 mb-2">404</h1>
      <p className="text-gray-500 mb-6 text-center">
        Ooops! The page you’re looking for doesn’t exist.
      </p>

      {/* Back Home Button */}
      <Link href="/">
        <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
          Go Back Home
        </button>
      </Link>
    </div>
  );
}