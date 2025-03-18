'use client'

import { useState, useEffect } from 'react'
import { GameCell } from './GameCell'
import { GameControls } from './GameControls'
import { useGameState } from '@/hooks/useGameState'
import { WinMessage } from './WinMessage'

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
    winAmount
  } = useGameState()

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
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <WinMessage 
        show={showWinMessage} 
        winAmount={winAmount} 
        multiplier={currentMultiplier}
      />
      <div className="w-full max-w-3xl bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-zinc-700/50">
        <div className="flex justify-between items-center mb-4">
          <div className="bg-zinc-900/50 rounded-lg p-3">
            <p className="text-xs text-zinc-400">Saldo</p>
            <p className="text-xl font-bold text-white">
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          {isPlaying ? (
            <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
              <p className="text-xs text-zinc-400">Multiplicador</p>
              <p className="text-xl font-bold text-emerald-400">
                {currentMultiplier.toFixed(2)}x
              </p>
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
        />
      </div>
    </div>
  )
} 