'use client'

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

interface GameHistoryProps {
  history: GameResult[]
  winStreak: number
  bestMultiplier: number
  totalWins: number
  totalGames: number
}

export function GameHistory({
  history,
  winStreak,
  bestMultiplier,
  totalWins,
  totalGames
}: GameHistoryProps) {
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : '0.0'

  return (
    <div className="bg-zinc-900/50 rounded-lg p-4">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
          <p className="text-xs text-zinc-400">Sequência de Vitórias</p>
          <p className="text-2xl font-bold text-yellow-400">{winStreak}🔥</p>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
          <p className="text-xs text-zinc-400">Melhor Multiplicador</p>
          <p className="text-2xl font-bold text-emerald-400">{bestMultiplier.toFixed(2)}x</p>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
          <p className="text-xs text-zinc-400">Total de Vitórias</p>
          <p className="text-2xl font-bold text-blue-400">{totalWins}</p>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
          <p className="text-xs text-zinc-400">Taxa de Vitória</p>
          <p className="text-2xl font-bold text-purple-400">{winRate}%</p>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-3">Últimas Jogadas</h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        {history.map((game) => (
          <div
            key={game.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              game.isWin ? 'bg-emerald-900/20' : 'bg-red-900/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-2xl`}>
                {game.isWin ? '🎯' : '💣'}
              </span>
              <div>
                <p className="text-sm font-medium text-white">
                  R$ {formatCurrency(game.betAmount)} → R$ {formatCurrency(game.winAmount)}
                </p>
                <p className="text-xs text-zinc-400">
                  {formatDate(game.date)} • {game.difficulty} • Linha {game.stoppedAtRow + 1}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${
                game.isWin ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {game.multiplier.toFixed(2)}x
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 