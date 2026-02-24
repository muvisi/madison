"use client";

interface InputFieldProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}

export default function InputField({
  type = "text",
  placeholder,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}