"use client";

import { FiInfo } from "react-icons/fi";

interface TooltipTextProps {
  text: string;
  maxLength?: number;
}

export default function TooltipText({
  text,
  maxLength = 50,
}: TooltipTextProps) {
  if (text.length <= maxLength) {
    return <>{text}</>;
  }

  return (
    <span
      title={text}
      className="inline-flex max-w-xs cursor-help items-center gap-1"
    >
      <span className="truncate">
        {text}
      </span>

      <FiInfo className="h-4 w-4 shrink-0 text-blue-500" />
    </span>
  );
}