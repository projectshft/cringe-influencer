import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY ?? '',
});

let queryCache = null;

function loadQueryCache() {
	if (queryCache) return queryCache;

	const cachePath = path.join(process.cwd(), 'libs', 'query-cache.json');
	if (fs.existsSync(cachePath)) {
		queryCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
		return queryCache;
	}
	return {};
}

export function getCachedEmbedding(text) {
	const cache = loadQueryCache();
	return cache[text] || null;
}

/**
 * Create an embedding for a single text
 * @param {string} text - The text to create an embedding for
 * @param {number} dimensions - The dimensions of the embedding vector (default: 1536)
 * @param {boolean} useCache - Whether to check cache first (default: true)
 * @returns {Promise<number[]>} - Promise resolving to the embedding vector
 */
export async function createEmbedding(text, dimensions = 1536, useCache = true) {
	if (useCache) {
		const cached = getCachedEmbedding(text);
		if (cached) return cached;
	}

	const response = await openai.embeddings.create({
		model: 'text-embedding-3-small',
		input: text,
		dimensions: dimensions,
	});

	return response.data[0].embedding;
}

/**
 * Create embeddings for multiple texts
 * @param {string[]} texts - Array of texts to create embeddings for
 * @param {number} dimensions - The dimensions of the embedding vectors (default: 1536)
 * @returns {Promise<number[][]>} - Promise resolving to an array of embedding vectors
 */
export async function createEmbeddings(texts, dimensions = 1536) {
	try {
		const response = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			input: texts,
			dimensions: dimensions,
		});

		return response.data.map((item) => item.embedding);
	} catch (error) {
		console.error('Error creating embeddings:', error);
		throw error;
	}
}
