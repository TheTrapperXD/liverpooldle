import React, { useEffect, useState } from 'react'

export default function Keyboard({ usedKeys, onKeyPress }) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ]

  return (
    <div className="keyboard">
      {rows.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map((key) => {
            const color = usedKeys[key] || ''
            return (
              <button
                key={key}
                className={`key ${color}`}
                onClick={() => onKeyPress(key)}
              >
                {key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}