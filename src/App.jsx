/* --- src/App.jsx --- */
import { useState, useEffect } from 'react'
import './App.css'
import playerData from './data.json'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard'
import { getDailyPlayer } from './lib/daily'

async function hashGuess(guess) {
  const SALT = "BRIDGEWIRTZ"; 
  const msgBuffer = new TextEncoder().encode(guess.toUpperCase() + SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

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
  // load guess
  const [guesses, setGuesses] = useState(() => {
    const saved = localStorage.getItem('liverpooldle_data')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.solutionId === daily.solution.id) {
        return parsed.guesses
      }
    }
    return []
  })
  // load win
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
  // memory
  useEffect(() => {
    localStorage.setItem('liverpooldle_data', JSON.stringify({
      solutionId: solution.id,
      guesses: guesses,
      isCorrect: isCorrect,
      hint: hint
    }))
  }, [guesses, isCorrect, solution.id, hint]) 

  // grid
  const generateEmojiGridText = () => {
    return guesses.map(guess => {
      return guess.map(letter => {
        if (letter.color === 'green') return '🟩'
        if (letter.color === 'yellow') return '🟨'
        return '⬛'
      }).join('')
    }).join('\n')
  }
  // share
  const [shareStatus, setShareStatus] = useState('') 
  const handleShare = () => {
    const emojiGrid = generateEmojiGridText()
    const score = isCorrect ? guesses.length : 'X'
    const shareText = `Liverpooldle ${score}/6\n\n${emojiGrid}\n\nhttps://thetrapperxd.github.io/liverpooldle/`

    navigator.clipboard.writeText(shareText).then(() => {
      setShareStatus('Copied to clipboard!')
      setTimeout(() => setShareStatus(''), 2000)
    })
  }
  const [hideModal, setHideModal] = useState(false)
  // Helper formatting guess
  const formatGuess = () => {
    let solutionArray = solution.guessing_name.split('')
    let formattedGuess = currentGuess.split('').map((l) => {
      return { key: l, color: 'grey' }
    })
    formattedGuess.forEach((l, i) => {
      if (solutionArray[i] === l.key) {
        formattedGuess[i].color = 'green'
        solutionArray[i] = null
      }
    })
    formattedGuess.forEach((l, i) => {
      if (l.color !== 'green' && solutionArray.includes(l.key)) {
        formattedGuess[i].color = 'yellow'
        solutionArray[solutionArray.indexOf(l.key)] = null
      }
    })

    return formattedGuess
  }

  // Handle Hint
  const revealHint = () => {
    const attributes = ['nationality', 'position', 'first_season']
    const fixedIndex = daily.dayIndex % attributes.length
    
    const selectedAttr = attributes[fixedIndex]
    let label = ''
    if (selectedAttr === 'nationality') label = 'Nationality 🌍'
    if (selectedAttr === 'position') label = 'Position ⚽'
    if (selectedAttr === 'first_season') label = 'First Season 📅'

    setHint(`${label}: ${solution[selectedAttr]}`)
  }

  // Keyboard state helper
  const usedKeys = {}
  guesses.forEach((guess) => {
    guess.forEach((l) => {
      const currentColor = usedKeys[l.key]
      if (l.color === 'green') {
        usedKeys[l.key] = 'green'
        return
      }
      if (l.color === 'yellow' && currentColor !== 'green') {
        usedKeys[l.key] = 'yellow'
        return
      }
      if (l.color === 'grey' && currentColor !== 'green' && currentColor !== 'yellow') {
        usedKeys[l.key] = 'grey'
        return
      }
    })
  })

  // Handle input logic
  const handleInput = (key) => {
    if (isCorrect || guesses.length >= 6) {
        return
    }

    if (key === 'Enter' || key === 'ENTER') {
        if (currentGuess.length !== solution.guessing_name.length) {
            return
        }
        const formatted = formatGuess()
        setGuesses((prev) => [...prev, formatted])
        setCurrentGuess('')
        let isWin = true
        formatted.forEach((l) => {
            if (l.color !== 'green') isWin = false
        })
        if (isWin) {
            setIsCorrect(true)
        }
        return
    }

    if (key === 'Backspace' || key === '⌫') {
        setCurrentGuess((prev) => prev.slice(0, -1))
        return
    }
    // regex
    if (/^[A-Za-z]$/.test(key)) {
        if (currentGuess.length < solution.guessing_name.length) {
            setCurrentGuess((prev) => prev + key.toUpperCase())
        }
    }
  }

  // Attach keyboard listeners
  useEffect(() => {
    const handleKeyup = (event) => {
      handleInput(event.key); 
    }

    window.addEventListener('keyup', handleKeyup)
    return () => window.removeEventListener('keyup', handleKeyup)
    
  }, [currentGuess, guesses, solution, isCorrect])

  // check
  const isGameOver = isCorrect || guesses.length >= 6

  return (
    <div className="game-container">
      <h1 className="game-title">Liverpooldle</h1>
      
      <Grid 
        currentGuess={currentGuess} 
        guesses={guesses} 
        solutionLength={solution.guessing_name.length} 
      />
      
      <div className="hint-container">
        {!hint && !isCorrect && (
          <button className="hint-btn" onClick={revealHint}>
            Get a Hint 💡
          </button>
        )}
        {hint && <p className="hint-text">{hint}</p>}
      </div>
      
      <Keyboard usedKeys={usedKeys} onKeyPress={handleInput} />
      {isGameOver && !hideModal && (
        <>
          <div className="modal-scrim"></div>
          
          <div className="modal">
            <button className="close-btn" onClick={() => setHideModal(true)}>
              ✕
            </button>
            <div className="modal-content">
              <h2>{isCorrect ? "YOU'LL NEVER WALK ALONE!" : "Unlucky lad! 😔"}</h2>
              
              <div className="recap-section">
                <p className="recap-item">
                  <strong>The answer was:</strong> {solution.full_name}
                </p>
                <p className="recap-item">
                  <strong>Attempts:</strong> {isCorrect ? guesses.length : 'X'}/6
                </p>
              </div>
              <div className="emoji-summary-container">
                {generateEmojiGridText()}
              </div>
              <button className="share-btn" onClick={handleShare}>
                SHARE RESULTS
              </button>
              {shareStatus && <p className="share-status">{shareStatus}</p>}
            </div>
          </div>
        </>
      )}
      <a 
        href="https://ko-fi.com/liverpooldle" 
        target="_blank" 
        rel="noopener noreferrer"
        className="kofi-btn"
      >
        <img 
          src="https://storage.ko-fi.com/cdn/cup-border.png" 
          alt="Ko-fi" 
          className="kofi-img" 
        />
        <span>Buy Me A Coffee</span>
      </a>

    </div>
  )
}

export default App