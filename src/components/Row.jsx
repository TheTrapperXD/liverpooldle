import React from 'react'

export default function Row({ guess, currentGuess, length }) {

  // previous guess
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
  // current guess
  if (currentGuess) {
    let letters = currentGuess.split('')
    
    return (
      <div className="row">
        {letters.map((letter, i) => (
          <div key={i} className="tile filled">{letter}</div>
        ))}
        {[...Array(Math.max(0, length - letters.length))].map((_, i) => (
          <div key={i + letters.length} className="tile"></div>
        ))}
      </div>
    )
  }
  // other row
  return (
    <div className="row">
      {[...Array(length || 5)].fill('').map((_, i) => (
        <div key={i} className="tile"></div>
      ))}
    </div>
  )
}