import React from 'react'
import Row from './Row'

export default function Grid({ currentGuess, guesses, solutionLength }) {
  // Create empty rows for the turns we haven't played yet
  const empties = Array(Math.max(0, 6 - 1 - guesses.length)).fill(null)

  return (
    <div>
      {/* 1. PAST GUESSES (The "History") 
          These use the 'guess' prop because they are Arrays of Objects (with colors) */}
      {guesses.map((g, i) => (
        <Row key={i} guess={g} length={solutionLength} />
      ))}

      {/* 2. CURRENT GUESS (What you are typing NOW) 
          We use the 'currentGuess' prop for the String (no colors yet) */}
      <Row currentGuess={currentGuess} length={solutionLength} />

      {/* 3. EMPTY ROWS (Future turns) */}
      {empties.map((_, i) => (
        <Row key={i} guess={null} length={solutionLength} />
      ))}
    </div>
  )
}