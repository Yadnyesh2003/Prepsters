import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';

const Rating = ({ initialRating = 0, onRate, size = 24 }) => {
  const [rating, setRating] = useState(initialRating || 0);

  const handleClick = (value) => {
    setRating(value);
    onRate?.(value);
  };

  useEffect(() => {
    setRating(initialRating || 0);
  }, [initialRating]);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= rating;
        return (
        <img
          key={i}
          src={isFilled ? assets.star_yellow : assets.star_white}
          alt={`star-${starValue}`}
          className="cursor-pointer transition duration-200 transform hover:scale-110"
          style={{ width: size, height: size }}
          onClick={() => handleClick(starValue)}
        />
        );
      })}
    </div>
  );
};

export default Rating;
