import { useState, useEffect } from 'react'
import './App.css'
import playerData from './data.json'
import Grid from './components/Grid'

function App() {
  const [solution, setSolution] = useState(playerData[0])
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState([])
  const [isCorrect, setIsCorrect] = useState(false)

  // Helper: Compare guess to solution
  const formatGuess = () => {
    console.log("Formatting guess:", currentGuess) // DEBUG
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
          console.log("Game Over! No more guesses.")
          return
        }

        // STOP if word is too short
        if (currentGuess.length !== solution.guessing_name.length) {
          console.log("Word too short!")
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
      <h1>Liverpooldle</h1>
      
      <Grid 
        currentGuess={currentGuess} 
        guesses={guesses} 
        solutionLength={solution.guessing_name.length} 
      />
      {/* WIN MODAL */}
      {isCorrect && (
        <div className="modal">
          <h2>YOU'LL NEVER WALK ALONE! 🔴</h2>
          <p>You guessed {solution.full_name}</p>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}

      {/* LOSE MODAL (Added this) */}
      {!isCorrect && guesses.length >= 6 && (
        <div className="modal">
          <h2>Unlucky! 😔</h2>
          <p>The player was: <strong>{solution.full_name}</strong></p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

    </div>
  )
}

export default App