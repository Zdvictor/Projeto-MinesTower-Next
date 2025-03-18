'use client'

interface GameControlsProps {
  betAmount: number
  onBetChange: (amount: number) => void
  onPlay: () => void
  onCashout: () => void
  isPlaying: boolean
}

export function GameControls({
  betAmount,
  onBetChange,
  onPlay,
  onCashout,
  isPlaying,
}: GameControlsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^0+/, '')
    const numericValue = value === '' ? 0 : parseFloat(value)
    onBetChange(numericValue)
  }

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
              type="number"
              value={betAmount || ''}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-800 text-white text-lg font-medium rounded-lg 
                border border-zinc-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                placeholder:text-zinc-600"
              placeholder="0,00"
              min={0}
              step={0.1}
            />
          </div>
        </div>
      )}

      <button
        onClick={isPlaying ? onCashout : onPlay}
        disabled={!isPlaying && (betAmount <= 0)}
        className={`
          w-full py-3 rounded-lg font-bold text-white text-lg
          transition-all duration-300
          ${
            isPlaying
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
              : betAmount <= 0
              ? 'bg-zinc-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }
        `}
      >
        {isPlaying ? 'Retirar Ganhos' : 'Jogar'}
      </button>
    </div>
  )
} 