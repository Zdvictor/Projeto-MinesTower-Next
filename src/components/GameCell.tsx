'use client'

type CellStatus = 'hidden' | 'diamond' | 'bomb'

interface GameCellProps {
  status: CellStatus
  onClick: () => void
  disabled: boolean
  revealed?: boolean
  isCurrentRow: boolean
}

export function GameCell({ status, onClick, disabled, revealed, isCurrentRow }: GameCellProps) {
  const getEmoji = () => {
    if (!revealed) {
      return '🔒'
    }
    switch (status) {
      case 'diamond':
        return '💎'
      case 'bomb':
        return '💣'
      default:
        return '🔒'
    }
  }

  const getStyles = () => {
    if (!revealed) {
      if (isCurrentRow) {
        return 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 ring-1 ring-white/50'
      }
      return 'bg-blue-900 opacity-75'
    }

    switch (status) {
      case 'diamond':
        return 'bg-emerald-600'
      case 'bomb':
        return 'bg-red-600'
      default:
        return 'bg-blue-600'
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || revealed || !isCurrentRow}
      className={`
        ${getStyles()}
        w-full aspect-square rounded-md
        flex items-center justify-center
        text-base shadow-md
        transition-all duration-300 transform
        hover:scale-[1.02] active:scale-95
        disabled:opacity-90 disabled:cursor-not-allowed
        disabled:hover:scale-100 disabled:active:scale-100
        border border-black/10
      `}
    >
      <span className="drop-shadow-sm filter">{getEmoji()}</span>
    </button>
  )
} 