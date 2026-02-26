"use client";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  color?: "blue" | "red" | "green";
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function Button({
  text,
  onClick,
  type = "button",
  color = "blue",
  fullWidth = true,
  disabled = false,
}: ButtonProps) {
  let bgColor = "bg-blue-600 hover:bg-blue-700";
  if (color === "red") bgColor = "bg-red-600 hover:bg-red-700";
  if (color === "green") bgColor = "bg-green-600 hover:bg-green-700";

  const ringColor = color === "blue" ? "blue-300" : color === "red" ? "red-300" : "green-300";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${bgColor} ${
        disabled ? "opacity-50 cursor-not-allowed hover:bg-none" : ""
      } text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-${ringColor} ${
        fullWidth ? "w-full" : ""
      } transition`}
    >
      {text}
    </button>
  );
}