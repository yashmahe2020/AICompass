"use client";

import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={`bg-gray-800 text-gray-100 border border-yellow-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-500 ${className || ""}`}
    />
  );
} 