"use client";

import { useState } from "react";

interface FiveStarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

export function FiveStarRating({ rating, onRatingChange, disabled = false }: FiveStarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex space-x-1">
      {stars.map((star) => (
        <Star
          key={star}
          filled={star <= rating}
          onClick={() => !disabled && onRatingChange(star)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

interface StarProps {
  filled: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const Star = ({ filled, onClick, disabled = false }: StarProps) => {
  return (
    <span
      onClick={onClick}
      className={`${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} text-xl transition-colors ${
        filled ? "text-yellow-600" : "text-gray-400 hover:text-yellow-500"
      }`}
    >
      ★
    </span>
  );
};
