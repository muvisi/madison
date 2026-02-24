"use client";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  color?: "blue" | "red" | "green";
  fullWidth?: boolean;
}

export default function Button({
  text,
  onClick,
  type = "button",
  color = "blue",
  fullWidth = true,
}: ButtonProps) {
  let bgColor = "bg-blue-600 hover:bg-blue-700";
  if (color === "red") bgColor = "bg-red-600 hover:bg-red-700";
  if (color === "green") bgColor = "bg-green-600 hover:bg-green-700";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${bgColor} text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-${color}-300 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {text}
    </button>
  );
}