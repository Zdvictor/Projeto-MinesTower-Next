import { GameBoard } from '@/components/GameBoard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-white mb-8">Mines Tower</h1>
          <GameBoard />
        </div>
      </div>
    </main>
  )
}
