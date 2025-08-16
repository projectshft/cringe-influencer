import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY ?? '',
});

export async function createEmbedding(
	text: string,
	dimensions: number = 512
): Promise<number[]> {
	try {
		const response = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			input: text,
			dimensions: dimensions,
		});

		return response.data[0].embedding as number[];
	} catch (error) {
		console.error('Error creating embedding:', error);
		throw error;
	}
}

export async function createEmbeddings(
	texts: string[],
	dimensions: number = 512
): Promise<number[][]> {
	try {
		const response = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			input: texts,
			dimensions: dimensions,
		});

		return response.data.map((item) => item.embedding as number[]);
	} catch (error) {
		console.error('Error creating embeddings:', error);
		throw error;
	}
}
