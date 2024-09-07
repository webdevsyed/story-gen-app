'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wand2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

export default function StoryPage() {
    const searchParams = useSearchParams()
    const [story, setStory] = useState('')
    const [cost, setCost] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    // const [tokenUsage, setTokenUsage] = useState<{ completionTokens: number, promptTokens: number, totalTokens: number } | null>(null)

    useEffect(() => {
        const generateStory = async () => {
            const formData = Object.fromEntries(searchParams.entries())
            setIsLoading(true)
            try {
                const response = await fetch('/api/generate-story', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(`Failed to generate story: ${errorData.error}`)
                }

                const data = await response.json()
                setStory(data.text)
                setCost(data.cost)
                // setTokenUsage(data.usage)
                setIsLoading(false)
            } catch (error: any) {
                console.error('Error generating story:', error)
                setStory('Sorry, we couldn\'t generate a story this time. Error: ' + error.message)
                setIsLoading(false)
            }
        }

        generateStory()
    }, [searchParams])

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex flex-col">
            <header className="pt-8 px-4 text-center flex flex-col items-center justify-center relative">
                <h1 className="text-5xl font-extrabold text-purple-600">
                    <Link href="/">AI STORY MAKER</Link>
                </h1>

                <div className="sm:absolute sm:top-6 sm:right-4 bg-blue-50 rounded-lg p-2">
                    <p className="text-sm text-gray-600">Story cost: ${cost.toFixed(3)}</p>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 pt-4 pb-4 ">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
                    {isLoading ? (
                        <div className="text-center">
                            <p className="text-lg">Generating your story...</p>
                        </div>
                    ) : (
                        <>
                            <div className="prose max-w-none">
                                <h2 className="text-2xl font-bold mb-4 text-center">Your AI-Generated Story</h2>
                                <article className='prose space-y-4 text-lg'>
                                    <ReactMarkdown>{story}</ReactMarkdown>
                                </article>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <Button variant="outline" size="lg" onClick={() => window.history.back()}>
                                    <ArrowLeft className="mr-2 h-5 w-5" />
                                    Create New Story
                                </Button>
                                <div className="flex space-x-4">
                                    <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
                                        <Wand2 className="mr-2 h-5 w-5" />
                                        Regenerate
                                    </Button>
                                    {/* <Button variant="outline" size="lg">
                                        <Share2 className="mr-2 h-5 w-5" />
                                        Share
                                    </Button> */}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
            {/* 
            <footer className="py-4 px-4 text-center text-sm text-gray-600">
                <p>&copy; 2023 AI Story Generator. All rights reserved.</p>
                <div className="mt-2 space-x-4">
                    <a href="#" className="hover:underline">About</a>
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Terms of Service</a>
                </div>
            </footer> */}
        </div>
    )
}