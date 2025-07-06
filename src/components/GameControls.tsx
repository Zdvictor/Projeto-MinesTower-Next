'use client'

import { useCurrencyInput } from '@/hooks/useCurrencyInput'

interface GameControlsProps {
  betAmount: number
  onBetChange: (amount: number) => void
  onPlay: () => void
  onCashout: () => void
  isPlaying: boolean
  balance: number
  onRecharge: () => void
}

export function GameControls({
  betAmount,
  onBetChange,
  onPlay,
  onCashout,
  isPlaying,
  balance,
  onRecharge,
}: GameControlsProps) {
  const { formattedValue, handleChange } = useCurrencyInput(betAmount, onBetChange)

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (betAmount === 0) {
      e.target.value = ''
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      onBetChange(0)
    }
  }

  const showRechargeButton = balance < 1000 && !isPlaying

  return (
    <div className="space-y-4">
      {!isPlaying && (
        <div className="bg-zinc-900/50 rounded-lg p-3">
          <label className="block text-xs text-zinc-400 mb-1">
            Valor da Aposta
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">
              R$
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={formattedValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-800 text-white text-lg font-medium rounded-lg 
                border border-zinc-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                placeholder:text-zinc-600"
              placeholder="0,00"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
      <button
        onClick={isPlaying ? onCashout : onPlay}
          disabled={!isPlaying && (betAmount <= 0 || betAmount > balance)}
        className={`
          w-full py-3 rounded-lg font-bold text-white text-lg
          transition-all duration-300
          ${
            isPlaying
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                : betAmount <= 0 || betAmount > balance
              ? 'bg-zinc-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }
        `}
      >
        {isPlaying ? 'Retirar Ganhos' : 'Jogar'}
      </button>

        {showRechargeButton && (
          <button
            onClick={onRecharge}
            className="w-full py-3 rounded-lg font-bold text-white text-lg
              bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700
              transition-all duration-300"
          >
            Recarregar Saldo
          </button>
        )}
      </div>
    </div>
  )
} 