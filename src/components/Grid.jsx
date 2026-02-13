import React from 'react'
import Row from './Row'

export default function Grid({ currentGuess, guesses, solutionLength }) {
  const empties = Array(Math.max(0, 6 - 1 - guesses.length)).fill(null)

  return (
    <div>
      {/*previous guess*/}
      {guesses.map((g, i) => (
        <Row key={i} guess={g} length={solutionLength} />
      ))}

      {/*current guess*/}
      {guesses.length < 6 && (
        <Row currentGuess={currentGuess} length={solutionLength} />
      )}

      {/*other row*/}
      {empties.map((_, i) => (
        <Row key={i} guess={null} length={solutionLength} />
      ))}
    </div>
  )
}