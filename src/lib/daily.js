const EPOCH_MS = new Date('2026-01-01T00:00:00').valueOf()
const MS_IN_DAY = 86400000 

export function getDailyPlayer(players) {
  const now = Date.now()
  const dayIndex = Math.floor((now - EPOCH_MS) / MS_IN_DAY)
  const prime = 37
  const solutionIndex = (dayIndex * prime) % players.length

  return {
    solution: players[solutionIndex],
    dayIndex: dayIndex
  }
}