import React from 'react'

interface WinMessageProps {
  show: boolean
  winAmount: number
  multiplier: number
}

export function WinMessage({ show, winAmount, multiplier }: WinMessageProps) {
  if (!show) return null

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-green-800 p-8 rounded-lg shadow-lg text-center text-white animate-bounce">
        <h2 className="text-4xl font-bold mb-4">🎉 VOCÊ GANHOU! 🎉</h2>
        <p className="text-2xl mb-2">
          Valor Ganho: <span className="font-bold text-yellow-400">R$ {formatCurrency(winAmount)}</span>
        </p>
        <p className="text-xl">
          Multiplicador Final: <span className="font-bold text-yellow-400">{multiplier.toFixed(2)}x</span>
        </p>
      </div>
    </div>
  )
} 