"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`bg-gray-800 text-gray-100 border border-yellow-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-500 ${className || ""}`}
    />
  );
} 