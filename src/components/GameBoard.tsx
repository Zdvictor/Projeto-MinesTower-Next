'use client'

import { useState, useEffect } from 'react'
import { GameCell } from './GameCell'
import { GameControls } from './GameControls'
import { useGameState } from '@/hooks/useGameState'
import { WinMessage } from './WinMessage'
import { RechargeMessage } from './RechargeMessage'
import { GameHistory } from './GameHistory'

export function GameBoard() {
  const {
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
  } = useGameState()

  // Estado para controlar a visibilidade do histórico em telas pequenas
  const [showHistory, setShowHistory] = useState(false)

  const formatBalance = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Calcula o valor potencial de ganho
  const potentialWin = betAmount * currentMultiplier

  if (!isClient) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-zinc-700/50">
          <div className="space-y-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-12 w-28 bg-zinc-700/50 rounded-lg"></div>
              <div className="h-12 w-28 bg-zinc-700/50 rounded-lg"></div>
            </div>
            <div className="grid grid-cols-5 gap-1.5 aspect-[5/3]">
              {Array(15).fill(null).map((_, i) => (
                <div key={i} className="w-full aspect-square bg-zinc-700/50 rounded-md"></div>
              ))}
            </div>
            <div className="h-10 bg-zinc-700/50 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative">
      <WinMessage 
        show={showWinMessage} 
        winAmount={winAmount} 
        multiplier={currentMultiplier}
      />
      <RechargeMessage show={showRechargeMessage} />

      {/* Botão de alternar histórico em telas pequenas */}
      <div className="w-full max-w-3xl mb-4 flex justify-end 2xl:hidden">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-zinc-800/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white font-medium
            hover:bg-zinc-700/50 transition-colors duration-200"
        >
          {showHistory ? '← Voltar ao Jogo' : 'Histórico →'}
        </button>
      </div>

      {/* Container Principal */}
      <div className="relative w-full flex justify-center">
        {/* Container do Jogo - Sempre centralizado */}
        <div className={`w-full max-w-3xl transition-all duration-300 ${
          showHistory ? 'hidden 2xl:block' : 'block'
        }`}>
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-zinc-700/50">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-zinc-900/50 rounded-lg p-3">
                <p className="text-xs text-zinc-400">Saldo</p>
                <p className="text-xl font-bold text-white">
                  R$ {formatBalance(balance)}
                </p>
              </div>
              {isPlaying ? (
                <div className="flex gap-4 flex-wrap justify-end">
                  <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-zinc-400">Multiplicador</p>
                    <p className="text-xl font-bold text-emerald-400">
                      {currentMultiplier.toFixed(2)}x
                    </p>
                  </div>
                  <div className="bg-zinc-900/50 rounded-lg p-3 text-center min-w-[160px]">
                    <p className="text-xs text-zinc-400">Ganho Potencial</p>
                    <p className="text-xl font-bold text-yellow-400">
                      R$ {formatBalance(potentialWin)}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Aposta: R$ {formatBalance(betAmount)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-900/50 rounded-lg p-3">
                  <p className="text-xs text-zinc-400 mb-1">Dificuldade</p>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="bg-zinc-800 text-white rounded px-3 py-1.5 text-sm border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="facil">Fácil (1 Bomba por Linha)</option>
                    <option value="medio">Médio (2 Bombas por Linha)</option>
                    <option value="dificil">Difícil (3 Bombas por Linha)</option>
                    <option value="extremo">Extremo (4 Bombas por Linha)</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-1.5 aspect-[5/3] mb-4">
              {cells.map((cell, index) => (
                <GameCell
                  key={index}
                  status={cell.status}
                  onClick={() => handleCellClick(index)}
                  disabled={!isPlaying}
                  revealed={cell.revealed}
                  isCurrentRow={cell.row === currentRow}
                />
              ))}
            </div>

            <GameControls
              betAmount={betAmount}
              onBetChange={setBetAmount}
              onPlay={startGame}
              onCashout={cashout}
              isPlaying={isPlaying}
              balance={balance}
              onRecharge={rechargeBalance}
            />
          </div>
        </div>

        {/* Container do Histórico - Absoluto à direita em telas MD+ */}
        <div className={`
          w-full md:w-[400px] transition-all duration-300
          ${showHistory ? 'block' : 'hidden 2xl:block'}
          xl:absolute md:-right-16 md:top-0
        `}>
          <GameHistory
            history={gameHistory}
            winStreak={winStreak}
            bestMultiplier={bestMultiplier}
            totalWins={totalWins}
            totalGames={totalGames}
          />
        </div>
      </div>
    </div>
  )
} 