import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const DynamicStoryContent = dynamic(() => import('./StoryContent'), {
    ssr: false,
})

export default function StoryPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-200 to-pink-200 flex flex-col">
            <header className="pt-8 px-4 text-center flex flex-col items-center justify-center relative">
                <h1 className="text-5xl font-extrabold text-purple-600">AI STORY MAKER</h1>
                <p className="text-xl text-indigo-600 mt-2">Your personalized story adventure!</p>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto border-4 border-purple-300">
                    <Suspense fallback={<div className="text-center text-2xl text-indigo-600 animate-pulse">Loading your magical story...</div>}>
                        <DynamicStoryContent />
                    </Suspense>
                </div>
            </main>
        </div>
    )
}