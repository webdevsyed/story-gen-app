'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Wand2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

export default function StoryContent() {
    const searchParams = useSearchParams()
    const [story, setStory] = useState('')
    const [cost, setCost] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [tokenUsage, setTokenUsage] = useState<{ completionTokens: number, promptTokens: number, totalTokens: number } | null>(null)

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
                setTokenUsage(data.usage)
                setIsLoading(false)
            } catch (error: any) {
                console.error('Error generating story:', error)
                setStory('Sorry, we couldn\'t generate a story this time. Error: ' + error.message)
                setIsLoading(false)
            }
        }

        generateStory()
    }, [searchParams])

    if (isLoading) {
        return <div className="text-center text-2xl text-indigo-600 animate-pulse">Creating your magical story...</div>
    }

    return (
        <>
            <div className="sm:absolute sm:top-6 sm:right-4 bg-blue-50 rounded-lg p-2">
                <p className="text-sm text-gray-600">Story cost: ${cost.toFixed(4)}</p>
            </div>

            <div className="prose max-w-none">
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-600">Your Magical Adventure</h2>
                <article className='prose font-medium text-lg'>
                    <ReactMarkdown>{story}</ReactMarkdown>
                </article>
            </div>

            {tokenUsage && (
                <div className="text-xs text-gray-500 mt-2">
                    <p>Input tokens: {tokenUsage.promptTokens}</p>
                    <p>Output tokens: {tokenUsage.completionTokens}</p>
                    <p>Total tokens: {tokenUsage.totalTokens}</p>
                </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button variant="outline" size="lg" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Create New Story
                    </Link>
                </Button>
                <div className="flex space-x-4">
                    <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Regenerate
                    </Button>
                    <Button variant="outline" size="lg">
                        <Share2 className="mr-2 h-5 w-5" />
                        Share
                    </Button>
                </div>
            </div>
        </>
    )
}