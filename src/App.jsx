import { useState, useEffect } from 'react'
import './App.css'
import playerData from './data.json'
import Grid from './components/Grid'
import { getDailyPlayer } from './lib/daily'

function App() {
  const daily = getDailyPlayer(playerData)
  
  const [solution, setSolution] = useState(daily.solution)
  const [hint, setHint] = useState(() => {
    const saved = localStorage.getItem('liverpooldle_data')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.solutionId === daily.solution.id) {
        return parsed.hint || null
      }
    }
    return null
  })
  
  // 1. LOAD GUESSES FROM MEMORY
  const [guesses, setGuesses] = useState(() => {
    const saved = localStorage.getItem('liverpooldle_data')
    if (saved) {
      const parsed = JSON.parse(saved)
      // CHECK IF ID MATCHES (Robust Fix)
      if (parsed.solutionId === daily.solution.id) {
        return parsed.guesses
      }
    }
    return []
  })

  // 2. LOAD WIN STATUS
  const [isCorrect, setIsCorrect] = useState(() => {
    const saved = localStorage.getItem('liverpooldle_data')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.solutionId === daily.solution.id) {
        return parsed.isCorrect
      }
    }
    return false
  })
  
  const [currentGuess, setCurrentGuess] = useState('')
  // SAVE TO MEMORY
  // SAVE TO MEMORY
  useEffect(() => {
    localStorage.setItem('liverpooldle_data', JSON.stringify({
      solutionId: solution.id,
      guesses: guesses,
      isCorrect: isCorrect,
      hint: hint // <--- ADD THIS
    }))
  }, [guesses, isCorrect, solution.id, hint]) // ADD hint to dependency array // Add solution.id to dependency

  // Helper: Compare guess to solution
  const formatGuess = () => {
    let solutionArray = solution.guessing_name.split('')
    let formattedGuess = currentGuess.split('').map((l) => {
      return { key: l, color: 'grey' }
    })

    // Green Check
    formattedGuess.forEach((l, i) => {
      if (solutionArray[i] === l.key) {
        formattedGuess[i].color = 'green'
        solutionArray[i] = null
      }
    })

    // Yellow Check
    formattedGuess.forEach((l, i) => {
      if (l.color !== 'green' && solutionArray.includes(l.key)) {
        formattedGuess[i].color = 'yellow'
        solutionArray[solutionArray.indexOf(l.key)] = null
      }
    })

    return formattedGuess
  }
  const revealHint = () => {
    const attributes = ['nationality', 'position', 'first_season']
    
    // THE FIX: Use the Day Number instead of Randomness
    // logic: (DayIndex) modulo (3 attributes) = 0, 1, or 2
    const fixedIndex = daily.dayIndex % attributes.length
    
    const selectedAttr = attributes[fixedIndex]
    
    // Formatting the text
    let label = ''
    if (selectedAttr === 'nationality') label = 'Nationality 🌍'
    if (selectedAttr === 'position') label = 'Position ⚽'
    if (selectedAttr === 'first_season') label = 'First Season 📅'

    setHint(`${label}: ${solution[selectedAttr]}`)
  }

  useEffect(() => {
    const handleKeyup = (event) => {
      const key = event.key

      // --- 1. ENTER KEY LOGIC ---
      if (key === 'Enter') {
        // STOP if game is won
        if (isCorrect) {
          return
        }

        // STOP if game is lost (Already have 6 guesses)
        if (guesses.length >= 6) {
          return
        }

        // STOP if word is too short
        if (currentGuess.length !== solution.guessing_name.length) {
          return
        }
        
        // If we pass all checks, format and save the guess
        const formatted = formatGuess()
        setGuesses((prev) => [...prev, formatted])
        setCurrentGuess('')

        // Check for Win
        let isWin = true
        formatted.forEach((l) => {
          if (l.color !== 'green') isWin = false
        })

        if (isWin) {
          setIsCorrect(true)
        }
      }

      // --- 2. BACKSPACE LOGIC ---
      if (key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1))
        return
      }

      // --- 3. TYPING LOGIC (A-Z) ---
      if (/^[A-Za-z]$/.test(key)) {
        // STOP if won
        if (isCorrect) {
          return 
        }

        // STOP if lost (Crucial Fix: Don't let them type if they have 6 guesses)
        if (guesses.length >= 6) {
          return 
        }

        // Add letter if space permits
        if (currentGuess.length < solution.guessing_name.length) {
          setCurrentGuess((prev) => prev + key.toUpperCase())
        }
      }
    }

    window.addEventListener('keyup', handleKeyup)
    return () => window.removeEventListener('keyup', handleKeyup)
    
  }, [currentGuess, guesses, solution, isCorrect]) // Ensure 'isCorrect' is here too!

  return (
    <div className="game-container">
      <h1 className="game-title">Liverpooldle</h1>
      
      <Grid 
        currentGuess={currentGuess} 
        guesses={guesses} 
        solutionLength={solution.guessing_name.length} 
      />
      
      {/* HINT SECTION */}
      <div className="hint-container">
        {!hint && !isCorrect && (
          <button className="hint-btn" onClick={revealHint}>
            Get a Hint 💡
          </button>
        )}
        {hint && <p className="hint-text">{hint}</p>}
      </div>
      {/* WIN MODAL */}
      {isCorrect && (
        <div className="modal">
          <h2>YOU'LL NEVER WALK ALONE! 🔴</h2>
          <p>You guessed {solution.full_name}</p>
          <div className="next-game-timer">
            <p>Next player available tomorrow!</p>
          </div>
        </div>
      )}

      {/* LOSE MODAL */}
      {!isCorrect && guesses.length >= 6 && (
        <div className="modal">
          <h2>Unlucky! 😔</h2>
          <p>The player was: <strong>{solution.full_name}</strong></p>
          <div className="next-game-timer">
            <p>Next player available tomorrow!</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default App