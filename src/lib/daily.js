// src/lib/daily.js

const EPOCH_MS = new Date('2026-01-01T00:00:00').valueOf()
const MS_IN_DAY = 86400000 

export function getDailyPlayer(players) {
  const now = Date.now()
  const dayIndex = Math.floor((now - EPOCH_MS) / MS_IN_DAY)

  // THE SEEDED SHUFFLE
  // We use the dayIndex to "seed" the random selection.
  // formula: (day * large_prime + offset) % length
  
  const prime = 37 // A nice prime number for hopping
  const solutionIndex = (dayIndex * prime) % players.length

  return {
    solution: players[solutionIndex],
    dayIndex: dayIndex
  }
}