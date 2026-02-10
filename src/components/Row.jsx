import React from 'react'

export default function Row({ guess, currentGuess, length }) {

  // Case 1: Past Guess (It is an Array of Objects with colors)
  // We check if it is an array to avoid crashing on strings
  if (guess && Array.isArray(guess)) {
    return (
      <div className="row">
        {guess.map((l, i) => (
          <div key={i} className={`tile ${l.color}`}>
            {l.key}
          </div>
        ))}
      </div>
    )
  }

  // Case 2: Current Typing (It is a String)
  if (currentGuess) {
    let letters = currentGuess.split('')
    
    return (
      <div className="row">
        {/* Filled Boxes */}
        {letters.map((letter, i) => (
          <div key={i} className="tile filled">{letter}</div>
        ))}
        
        {/* Empty Boxes (Rest of the row) */}
        {/* key={i + letters.length} ensures we don't have duplicate keys like '0' */}
        {[...Array(Math.max(0, length - letters.length))].map((_, i) => (
          <div key={i + letters.length} className="tile"></div>
        ))}
      </div>
    )
  }

  // Case 3: Empty Row (Future turns)
  return (
    <div className="row">
      {[...Array(length || 5)].fill('').map((_, i) => (
        <div key={i} className="tile"></div>
      ))}
    </div>
  )
}