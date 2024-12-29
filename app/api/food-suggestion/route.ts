import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ suggestion: text });
  } catch (error) {
    console.error('Error in food suggestion API:', error);
    return NextResponse.json({ error: 'Failed to get food suggestion' }, { status: 500 });
  }
}

