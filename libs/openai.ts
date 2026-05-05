import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY ?? '',
});

let queryCache: Record<string, number[]> | null = null;

function loadQueryCache(): Record<string, number[]> {
	if (queryCache) return queryCache;

	const cachePath = path.join(process.cwd(), 'libs', 'query-cache.json');
	if (fs.existsSync(cachePath)) {
		queryCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
		return queryCache!;
	}
	return {};
}

export function getCachedEmbedding(text: string): number[] | null {
	const cache = loadQueryCache();
	return cache[text] || null;
}

export async function createEmbedding(
	text: string,
	dimensions: number = 1536,
	useCache: boolean = true
): Promise<number[]> {
	if (useCache) {
		const cached = getCachedEmbedding(text);
		if (cached) return cached;
	}

	const response = await openai.embeddings.create({
		model: 'text-embedding-3-small',
		input: text,
		dimensions: dimensions,
	});

	return response.data[0].embedding as number[];
}

export async function createEmbeddings(
	texts: string[],
	dimensions: number = 1536
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
