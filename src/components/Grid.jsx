import React from 'react'
import Row from './Row'

export default function Grid({ currentGuess, guesses, solutionLength }) {
  // Calculate empty rows needed
  // We subtract 1 for the current row, but ONLY if we haven't lost yet
  const empties = Array(Math.max(0, 6 - 1 - guesses.length)).fill(null)

  return (
    <div>
      {/* 1. PAST GUESSES */}
      {guesses.map((g, i) => (
        <Row key={i} guess={g} length={solutionLength} />
      ))}

      {/* 2. CURRENT GUESS (The Fix: Only show if guesses < 6) */}
      {guesses.length < 6 && (
        <Row currentGuess={currentGuess} length={solutionLength} />
      )}

      {/* 3. EMPTY ROWS */}
      {empties.map((_, i) => (
        <Row key={i} guess={null} length={solutionLength} />
      ))}
    </div>
  )
}