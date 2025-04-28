"use client";

import { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function Label({ children, className, ...props }: LabelProps) {
  return (
    <label 
      {...props} 
      className={`block text-sm font-medium text-gray-700 ${className || ""}`}
    >
      {children}
    </label>
  );
} 