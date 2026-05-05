import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

export async function generateText(
	prompt: string,
	model: string = 'gemini-2.5-flash',
): Promise<string> {
	const geminiModel = genAI.getGenerativeModel({ model });

	const result = await geminiModel.generateContent(prompt);
	const response = result.response;

	return response.text();
}
