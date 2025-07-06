'use client'

interface RechargeMessageProps {
  show: boolean
}

export function RechargeMessage({ show }: RechargeMessageProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-xl animate-bounce">
        <p className="text-xl font-bold">Saldo Recarregado!</p>
        <p className="text-sm opacity-90">Seu saldo foi recarregado para R$ 10.000,00</p>
      </div>
    </div>
  )
} 