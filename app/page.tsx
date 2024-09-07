'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wand2, InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Home() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    aiModel: 'gpt4-mini',
    userName: '',
    ageRange: '3-5',
    gender: 'boy',
    genre: 'adventure',
    themes: [] as string[],
    mood: 'happy',
    setting: '',
    specialRequest: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter(t => t !== theme)
        : [...prev.themes, theme]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/story?${new URLSearchParams(formData as any).toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-pink-200 flex flex-col">
      <header className="pt-8 px-4 text-center flex flex-col items-center justify-center relative">
        <div>
          <h1 className="text-5xl font-extrabold text-purple-600">AI STORY MAKER</h1>
          <p className="text-xl text-indigo-600">Create your own amazing adventure!</p>
        </div>
        <div className="sm:absolute sm:top-6 sm:right-4">
          <Label className='font-bold mr-2' htmlFor="ai-model">AI Model</Label>
          <Select name="aiModel" value={formData.aiModel} onValueChange={handleSelectChange('aiModel')}>
            <SelectTrigger id="ai-model" className="w-[180px] bg-white opacity-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt4">ChatGPT 4.0</SelectItem>
              <SelectItem value="gpt4-mini">ChatGPT 4.0 Mini</SelectItem>
              <SelectItem value="claude-sonnet">Claude Sonnet</SelectItem>
              <SelectItem value="claude-haiku">Claude Haiku</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto border-4 border-purple-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className='font-bold' htmlFor="user-name">Your Name</Label>
              <Input
                id="user-name"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Enter your name (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label className='font-bold'>Age Range</Label>
              <RadioGroup defaultValue="3-5" onValueChange={handleSelectChange('ageRange')}>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3-5" id="age-3-5" />
                    <Label className='font-bold' htmlFor="age-3-5">3-5</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6-8" id="age-6-8" />
                    <Label className='font-bold' htmlFor="age-6-8">6-8</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="9-12" id="age-9-12" />
                    <Label className='font-bold' htmlFor="age-9-12">9-12</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className='font-bold'>Gender</Label>
              <RadioGroup defaultValue="boy" onValueChange={handleSelectChange('gender')}>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="boy" id="gender-boy" />
                    <Label className='font-bold' htmlFor="gender-boy">Boy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="girl" id="gender-girl" />
                    <Label className='font-bold' htmlFor="gender-girl">Girl</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label className='font-bold'>Genre</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Genre determines the overall type and style of the story</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <RadioGroup value={formData.genre} onValueChange={handleSelectChange('genre')}>
                <div className="grid grid-cols-2 gap-4">
                  {['adventure', 'fantasy', 'mystery', 'scifi', 'fairy tale', 'educational', 'historical', 'superhero'].map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <RadioGroupItem value={genre} id={`genre-${genre}`} />
                      <Label htmlFor={`genre-${genre}`}>{genre.charAt(0).toUpperCase() + genre.slice(1)}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label className='font-bold'>Themes</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Themes are the main ideas or messages in the story</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['animals', 'magic', 'friendship', 'nature', 'family', 'courage', 'creativity', 'Kinship', 'teamwork', 'curiosity', 'problem-solving', 'kindness'].map((theme) => (
                  <div key={theme} className="flex items-center space-x-2">
                    <Checkbox
                      id={`theme-${theme}`}
                      checked={formData.themes.includes(theme)}
                      onCheckedChange={() => handleCheckboxChange(theme)}
                    />
                    <Label htmlFor={`theme-${theme}`}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className='font-bold'>Story Mood</Label>
              <RadioGroup value={formData.mood} onValueChange={handleSelectChange('mood')}>
                <div className="flex space-x-4">
                  {['happy', 'exciting', 'mysterious', 'funny', 'calm'].map((mood) => (
                    <div key={mood} className="flex items-center space-x-2">
                      <RadioGroupItem value={mood} id={`mood-${mood}`} />
                      <Label htmlFor={`mood-${mood}`}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className='font-bold' htmlFor="setting">Story Setting</Label>
              <Input
                id="setting"
                name="setting"
                value={formData.setting}
                onChange={handleInputChange}
                placeholder="e.g., Enchanted Forest, Space Station, Underwater City"
              />
            </div>

            <div className="space-y-2">
              <Label className='font-bold' htmlFor="special-request">Special Request</Label>
              <Input
                id="special-request"
                name="specialRequest"
                value={formData.specialRequest}
                onChange={handleInputChange}
                placeholder="Any special elements you'd like in the story?"
              />
            </div>

            <Button type="submit" className="w-full text-xl py-6 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-400 transition-all duration-300" size="lg">
              <Wand2 className="mr-3 h-6 w-6 animate-pulse" />
              Create My Story!
            </Button>
          </form>
        </div>
      </main>
      {/* 
      <footer className="py-6 px-4 text-center text-base text-indigo-600">
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