'use client'

import { useState, useEffect } from 'react'

const INITIAL_BALANCE = 10000
const ROWS = 5
const COLS = 5

type CellStatus = 'hidden' | 'diamond' | 'bomb'
type Difficulty = 'facil' | 'medio' | 'dificil' | 'extremo'

interface Cell {
  status: CellStatus
  revealed: boolean
  realStatus: CellStatus
  row: number
  col: number
}

interface GameResult {
  id: string
  date: Date
  betAmount: number
  winAmount: number
  multiplier: number
  difficulty: string
  isWin: boolean
  stoppedAtRow: number
}

export function useGameState() {
  const [isClient, setIsClient] = useState(false)
  const [balance, setBalance] = useState(INITIAL_BALANCE)
  const [betAmount, setBetAmount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMultiplier, setCurrentMultiplier] = useState(1)
  const [currentRow, setCurrentRow] = useState(0)
  const [showWinMessage, setShowWinMessage] = useState(false)
  const [winAmount, setWinAmount] = useState(0)
  const [showRechargeMessage, setShowRechargeMessage] = useState(false)
  const [gameHistory, setGameHistory] = useState<GameResult[]>([])
  const [winStreak, setWinStreak] = useState(0)
  const [bestMultiplier, setBestMultiplier] = useState(1)
  const [totalWins, setTotalWins] = useState(0)
  const [totalGames, setTotalGames] = useState(0)
  const [cells, setCells] = useState<Cell[]>(() => 
    Array(ROWS * COLS).fill(null).map((_, index) => ({
      status: 'hidden',
      revealed: false,
      realStatus: 'hidden',
      row: Math.floor(index / COLS),
      col: index % COLS
    }))
  )
  const [difficulty, setDifficulty] = useState<Difficulty>('facil')
  const [winAudio, setWinAudio] = useState<HTMLAudioElement | null>(null)
  const [loseAudio, setLoseAudio] = useState<HTMLAudioElement | null>(null)
  const [diamondAudio, setDiamondAudio] = useState<HTMLAudioElement | null>(null)
  const [bombAudio, setBombAudio] = useState<HTMLAudioElement | null>(null)

  const difficultyConfig = {
    facil: { bombs: 1, multiplier: 1.2 },
    medio: { bombs: 2, multiplier: 1.5 },
    dificil: { bombs: 3, multiplier: 2.0 },
    extremo: { bombs: 4, multiplier: 3.0 }
  }

  useEffect(() => {
    setIsClient(true)
    const savedBalance = localStorage.getItem('balance')
    if (savedBalance) {
      setBalance(Number(savedBalance))
    }

    // Carrega o histórico do localStorage
    const savedHistory = localStorage.getItem('gameHistory')
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory, (key, value) => {
        if (key === 'date') return new Date(value)
        return value
      })
      setGameHistory(parsedHistory)
      
      // Recalcula as estatísticas
      const wins = parsedHistory.filter((game: GameResult) => game.isWin).length
      setTotalWins(wins)
      setTotalGames(parsedHistory.length)
      
      // Calcula a sequência atual de vitórias
      let streak = 0
      for (let i = parsedHistory.length - 1; i >= 0; i--) {
        if (parsedHistory[i].isWin) streak++
        else break
      }
      setWinStreak(streak)
      
      // Encontra o melhor multiplicador
      const bestMult = Math.max(...parsedHistory.map((game: GameResult) => game.multiplier))
      setBestMultiplier(bestMult)
    }

    // Inicializa os áudios
    const win = new Audio('/audio/win.mp3')
    win.volume = 0.5
    setWinAudio(win)

    const lose = new Audio('/audio/lose.mp3')
    lose.volume = 0.5
    setLoseAudio(lose)

    const diamond = new Audio('/audio/diamond.mp3')
    diamond.volume = 0.3
    setDiamondAudio(diamond)

    const bomb = new Audio('/audio/bomb.mp3')
    bomb.volume = 0.1
    setBombAudio(bomb)
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('balance', String(balance))
    }
  }, [balance, isClient])

  useEffect(() => {
    if (isClient && gameHistory.length > 0) {
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory))
    }
  }, [gameHistory, isClient])

  const addGameToHistory = (result: Omit<GameResult, 'id' | 'date'>) => {
    const newGame: GameResult = {
      ...result,
      id: crypto.randomUUID(),
      date: new Date()
    }

    setGameHistory(prev => {
      const newHistory = [newGame, ...prev].slice(0, 50) // Mantém apenas as últimas 50 jogadas
      return newHistory
    })

    setTotalGames(prev => prev + 1)
    
    if (result.isWin) {
      setTotalWins(prev => prev + 1)
      setWinStreak(prev => prev + 1)
      if (result.multiplier > bestMultiplier) {
        setBestMultiplier(result.multiplier)
      }
    } else {
      setWinStreak(0)
    }
  }

  const playSound = (type: 'win' | 'lose' | 'diamond' | 'bomb') => {
    if (!isClient) return
    const audioMap = {
      win: winAudio,
      lose: loseAudio,
      diamond: diamondAudio,
      bomb: bombAudio
    }
    const audio = audioMap[type]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
  }

  const startGame = () => {
    if (betAmount <= 0 || betAmount > balance) return
    setBalance(prev => prev - betAmount)
    setIsPlaying(true)
    setCurrentMultiplier(1)
    setCurrentRow(0)
    setShowWinMessage(false)
    setWinAmount(0)

    const newCells: Cell[] = Array(ROWS * COLS).fill(null).map((_, index) => ({
      status: 'hidden',
      revealed: false,
      realStatus: 'diamond',
      row: Math.floor(index / COLS),
      col: index % COLS
    }))

    // Adiciona bombas em cada linha baseado na dificuldade
    for (let row = 0; row < ROWS; row++) {
      const availableCols = Array.from({ length: COLS }, (_, i) => i)
      const bombsInRow = difficultyConfig[difficulty].bombs
      
      for (let i = 0; i < bombsInRow; i++) {
        const randomIndex = Math.floor(Math.random() * availableCols.length)
        const col = availableCols.splice(randomIndex, 1)[0]
        const cellIndex = row * COLS + col
        newCells[cellIndex].realStatus = 'bomb'
      }
    }

    setCells(newCells)
  }

  const handleCellClick = (index: number) => {
    if (!isPlaying || cells[index].revealed) return

    const clickedCell = cells[index]
    const cellRow = Math.floor(index / COLS)

    // Só permite clicar na linha atual
    if (cellRow !== currentRow) return

    const newCells = [...cells]
    clickedCell.revealed = true
    clickedCell.status = clickedCell.realStatus

    if (clickedCell.realStatus === 'bomb') {
      playSound('bomb')
      setIsPlaying(false)
      // Revela todas as células quando perde
      newCells.forEach(cell => {
        cell.revealed = true
        cell.status = cell.realStatus
      })
      setCells(newCells)
      
      // Adiciona a derrota ao histórico
      addGameToHistory({
        betAmount,
        winAmount: 0,
        multiplier: currentMultiplier,
        difficulty,
        isWin: false,
        stoppedAtRow: currentRow
      })
    } else {
      playSound('diamond')
      // Revela todas as células da linha atual
      newCells.forEach(cell => {
        if (cell.row === currentRow) {
          cell.revealed = true
          cell.status = cell.realStatus
        }
      })
      
      const newMultiplier = currentMultiplier * difficultyConfig[difficulty].multiplier
      setCurrentMultiplier(newMultiplier)
      
      // Avança para próxima linha ou finaliza o jogo
      if (currentRow < ROWS - 1) {
        setCurrentRow(prev => prev + 1)
      } else {
        // Ganhou o jogo
        const finalWinAmount = betAmount * newMultiplier
        setWinAmount(finalWinAmount)
        setShowWinMessage(true)
        // Timer para esconder a mensagem após 4 segundos
        setTimeout(() => {
          setShowWinMessage(false)
        }, 4000)
        cashout()
      }
      
      setCells(newCells)
    }
  }

  const cashout = () => {
    if (!isPlaying) return
    const finalWinAmount = betAmount * currentMultiplier
    setBalance(prev => prev + finalWinAmount)
    setIsPlaying(false)
    playSound('win')
    setWinAmount(finalWinAmount)
    setShowWinMessage(true)
    
    // Adiciona a vitória ao histórico
    addGameToHistory({
      betAmount,
      winAmount: finalWinAmount,
      multiplier: currentMultiplier,
      difficulty,
      isWin: true,
      stoppedAtRow: currentRow
    })
    
    // Timer para esconder a mensagem após 4 segundos
    setTimeout(() => {
      setShowWinMessage(false)
    }, 4000)
    
    // Revela todas as células quando faz cashout
    setCells(cells.map(cell => ({
      ...cell,
      revealed: true,
      status: cell.realStatus
    })))
  }

  const rechargeBalance = () => {
    setBalance(INITIAL_BALANCE)
    setShowRechargeMessage(true)
    // Esconde a mensagem após 3 segundos
    setTimeout(() => {
      setShowRechargeMessage(false)
    }, 3000)
  }

  return {
    balance,
    betAmount,
    setBetAmount,
    currentMultiplier,
    isPlaying,
    startGame,
    cashout,
    cells,
    handleCellClick,
    isClient,
    difficulty,
    setDifficulty,
    currentRow,
    showWinMessage,
    winAmount,
    rechargeBalance,
    showRechargeMessage,
    gameHistory,
    winStreak,
    bestMultiplier,
    totalWins,
    totalGames
  }
} 