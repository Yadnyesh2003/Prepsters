import React, { useState, useEffect } from 'react'

const Rating = ({ initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating || 0)

  const handleClick = (value) => {
    setRating(value)
    onRate?.(value)
  }

  useEffect(() => {
    if(initialRating)
      setRating(initialRating)
  }, [initialRating])

  return (
    <div>
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1
        return (
          <span
            key={i}
            className={`text-xl sm:text-2xl cursor-pointer transition-colors ${
              starValue <= rating ? 'text-yellow-500' : 'text-gray-400'
            }`}
            onClick={() => handleClick(starValue)}
          >
            &#9733;
          </span>
        )
      })}
    </div>
  )
}

export default Rating
