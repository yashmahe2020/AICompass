"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  show?: boolean;
}

export function Notification({
  className,
  children,
  onClose,
  show = true,
  ...props
}: NotificationProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md",
        "bg-white border border-gray-200 rounded-lg shadow-lg",
        "p-4 flex items-center justify-between gap-4",
        "animate-in slide-in-from-top duration-300",
        className
      )}
      {...props}
    >
      <div className="flex-1 text-yellow-600">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-yellow-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
} 