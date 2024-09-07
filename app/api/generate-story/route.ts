import { NextResponse, NextRequest } from 'next/server'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export const runtime = 'edge'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        console.log('Received body:', body)  // Log the received body

        const {
            aiModel,
            userName,
            ageRange,
            gender,
            genre,
            themes,
            mood,
            setting,
            specialRequest
        } = body

        const prompt = generatePrompt(
            userName,
            ageRange,
            gender,
            genre,
            Array.isArray(themes) ? themes : [themes].filter(Boolean),
            mood,
            setting,
            specialRequest)
        // console.log('Generated prompt:', prompt)  // Log the generated prompt

        let stream: any;
        let costCalculationFunction: (promptTokens: number, completionTokens: number) => number;

        switch (aiModel) {
            case 'gpt4':
            case 'gpt4-mini':
                stream = {
                    model: openai(getOpenAIModel(aiModel)),
                    prompt: prompt,
                    temperature: 0.7,
                    maxTokens: 1000,
                }
                costCalculationFunction = (promptTokens, completionTokens) =>
                    calculateOpenAICost(aiModel, promptTokens, completionTokens);
                break;
            case 'claude-sonnet':
            case 'claude-haiku':
                stream = {
                    model: anthropic(getAnthropicModel(aiModel)),
                    prompt: prompt,
                    temperature: 0.7,
                    maxTokens: 1000,
                }
                costCalculationFunction = (promptTokens, completionTokens) =>
                    calculateAnthropicCost(aiModel, promptTokens, completionTokens);
                break;
            default:
                return NextResponse.json({ error: 'Invalid AI model selected' }, { status: 400 })
        }

        // console.log('Stream configuration:', stream)  // Log the stream configuration

        const response = await generateText(stream)
        // console.log("response", response)
        // console.log('Generated text:', response.text)  // Log the generated text

        // Calculate the cost
        const cost = costCalculationFunction(
            response.usage.promptTokens,
            response.usage.completionTokens
        );

        return new Response(JSON.stringify({
            text: response.text,
            cost,
            usage: response.usage
        }), {
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error: any) {
        console.error('Error generating story:', error)
        return NextResponse.json({ error: 'Failed to generate story', details: error.message }, { status: 500 })
    }
}

function generatePrompt(
    userName: string,
    ageRange: string,
    gender: string,
    genre: string,
    themes: string[],
    mood: string,
    setting: string,
    specialRequest: string
) {
    const ageSpecificLanguage = {
        '3-5': 'very simple language, short sentences, and occasional rhymes',
        '6-8': 'simple language, mostly short sentences, and some fun wordplay',
        '9-12': 'more complex language, varied sentence structure, and engaging descriptions'
    }[ageRange] || 'age-appropriate language'

    const themeString = themes.join(', ')
    const protagonist = userName ? userName : `a ${ageRange} year old ${gender}`
    const rhymingInstruction = ageRange === '3-5' ? 'Include simple rhymes occasionally throughout the story.' :
        ageRange === '6-8' ? 'Use rhymes or wordplay in key moments of the story.' :
            'Consider using poetic language or rhymes for important story elements.'

    const prompt = `Task: Create an engaging, age-appropriate ${genre} story for young readers.
  
  Audience: The story is for ${protagonist}, so tailor the content and complexity accordingly.
  
  Style and Language:
  - Use ${ageSpecificLanguage}.
  - Maintain a ${mood} mood throughout the story.
  - ${rhymingInstruction}
  
  Setting: The story takes place in ${setting || "a setting that fits the genre and themes"}.
  
  Themes: Weave the following themes into the narrative: ${themeString}.
  
  Story Structure:
  1. Begin with "Once upon a time" or a similar engaging opening.
  2. Introduce the main character and the initial setting.
  3. Present a challenge or adventure related to the chosen genre and themes.
  4. Develop the story with age-appropriate obstacles and growth opportunities.
  5. Resolve the main conflict in a satisfying way.
  6. End with a clear conclusion, using "The End." or a similar closing phrase.
  
  Formatting:
  - Use proper paragraph spacing for readability.
  - Keep paragraphs short, especially for younger age groups.
  - Use line breaks strategically to enhance pacing and emphasis.
  - add bold and headings as needed for emphasis
  
  Length: Aim for approximately 300 words, adjusting slightly based on the age group.
  
  Additional Instructions:
  - Ensure the story promotes positive values and learning opportunities.
  - Include sensory details to make the story vivid and engaging.
  - Use dialogue to advance the plot and reveal character personalities.
  ${specialRequest ? `- Incorporate this special element: ${specialRequest}` : ''}
  
  Before starting, take a deep breath and approach this task with creativity and enthusiasm. Remember, you're crafting a magical experience for a young mind!`

    return prompt
}

function getOpenAIModel(aiModel: string) {
    switch (aiModel) {
        case 'gpt4o':
            return 'gpt-4o'
        case 'gpt4-mini':
            return 'gpt-4o-mini'
        default:
            return 'gpt-4o'
    }
}

function getAnthropicModel(aiModel: string) {
    switch (aiModel) {
        case 'claude-sonnet':
            return 'claude-3-5-sonnet-20240620'
        case 'claude-haiku':
            return 'claude-3-haiku-20240307'
        default:
            return 'claude-2'
    }
}


function calculateOpenAICost(aiModel: string, promptTokens: number, completionTokens: number) {
    const costPerToken = {
        'gpt4': { input: 0.00500, output: 0.01500 },
        'gpt4-mini': { input: 0.00015, output: 0.00060 },
    }[aiModel] || { input: 0.00500, output: 0.01500 }  // Default to gpt-4 pricing if model not found

    return (promptTokens * costPerToken.input + completionTokens * costPerToken.output) / 1000  // Convert from per 1M tokens to per token
}

function calculateAnthropicCost(aiModel: string, promptTokens: number, completionTokens: number) {
    const costPerToken = {
        'claude-sonnet': { input: 0.00300, output: 0.01500 },
        'claude-haiku': { input: 0.00025, output: 0.00125 },
    }[aiModel] || { input: 0.00300, output: 0.01500 }  // Default to Claude 3.5 Sonnet pricing if model not found

    return (promptTokens * costPerToken.input + completionTokens * costPerToken.output) / 1000  // Convert from per 1M tokens to per token
}