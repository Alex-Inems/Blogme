import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    console.log('--- AI Suggestion Request Received ---');
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        console.log('API Key detected:', apiKey ? 'YES (starts with ' + apiKey.substring(0, 10) + '...)' : 'NO');
        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            return NextResponse.json(
                { error: 'OpenAI API key is not configured. Please add it to your .env file.' },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            apiKey: apiKey,
        });

        const { currentTitle, currentContent, type } = await req.json();
        console.log('Request type:', type);
        console.log('Title length:', currentTitle?.length);
        console.log('Content length:', currentContent?.length);

        let systemPrompt = '';
        let userPrompt = '';

        if (type === 'title') {
            systemPrompt = 'You are a helpful assistant that suggests catchy and SEO-friendly blog post titles. Give 5 options. No preamble.';
            userPrompt = `Based on the following content, suggest 5 catchy titles for a blog post:\n\nContent: ${currentContent}`;
        } else if (type === 'content') {
            systemPrompt = 'You are a professional blog writer assistant. Suggest a brief outline or the next paragraph. No preamble.';
            userPrompt = `The user is writing a blog post with the title "${currentTitle}". Here is the current content: "${currentContent}". Suggest a brief outline or the next paragraph to continue the post. Limit to 2-3 sentences.`;
        } else if (type === 'tags') {
            systemPrompt = 'You are a helpful assistant that suggests relevant tags for blog posts. Give a comma-separated list. No preamble.';
            userPrompt = `Suggest 5-10 relevant tags for a blog post with title "${currentTitle}" and content snippet: "${currentContent.substring(0, 500)}".`;
        } else if (type === 'image') {
            // For images, we use a different OpenAI method, but we can still use the prompt logic
            const imagePrompt = `A professional, high-quality blog post feature image for a post titled "${currentTitle}". Style: modern, clean, and relevant to the topic. ${currentContent ? 'Content context: ' + currentContent.substring(0, 200) : ''}`;
            
            console.log('Generating image with prompt:', imagePrompt);
            const imageResponse = await openai.images.generate({
                model: "dall-e-3",
                prompt: imagePrompt,
                n: 1,
                size: "1024x1024",
                quality: "standard",
            });

            console.log('OpenAI image response received');
            if (!imageResponse.data || imageResponse.data.length === 0) {
                return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
            }
            return NextResponse.json({ suggestion: imageResponse.data[0].url });
        } else {
            return NextResponse.json({ error: 'Invalid suggestion type' }, { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
        });

        console.log('OpenAI response received');
        const suggestion = response.choices[0].message.content;

        return NextResponse.json({ suggestion });
    } catch (error: unknown) {
        console.error('OpenAI Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred with OpenAI';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
