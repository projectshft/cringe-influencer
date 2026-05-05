import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

export async function generateText(prompt, model = 'gemini-2.5-flash') {
	const geminiModel = genAI.getGenerativeModel({ model });

	const result = await geminiModel.generateContent(prompt);
	const response = result.response;

	return response.text();
}

export async function generatePost(context, style) {
	const prompt = style
		? `Based on the following context, write a LinkedIn post in this style: ${style}\n\nContext:\n${context}`
		: `Based on the following context, write a LinkedIn post:\n\nContext:\n${context}`;

	return generateText(prompt);
}
