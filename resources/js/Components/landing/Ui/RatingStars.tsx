import React from 'react';
import { StarIcon } from '../Icons/Icons';

interface Props {
  rating: number;
}

export const RatingStars: React.FC<Props> = ({ rating }) => {
  const full = Math.floor(rating);
  const partial = rating - full;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          className={`w-3.5 h-3.5 ${
            i < full
              ? 'text-yellow-400 fill-yellow-400'
              : i < full + 0.5 && partial >= 0.3
                ? 'text-yellow-400 fill-yellow-400/50'
                : 'text-gray-300'
          }`}
          filled={i < full}
        />
      ))}
      <span className="text-xs text-muted ml-1">{rating}</span>
    </div>
  );
};