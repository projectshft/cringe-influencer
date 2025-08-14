import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY ?? '',
});

/**
 * Create an embedding for a single text
 * @param {string} text - The text to create an embedding for
 * @param {number} dimensions - The dimensions of the embedding vector (default: 1536)
 * @returns {Promise<number[]>} - Promise resolving to the embedding vector
 */
export async function createEmbedding(text, dimensions = 1536) {
	try {
		const response = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			input: text,
			dimensions: dimensions,
		});

		return response.data[0].embedding;
	} catch (error) {
		console.error('Error creating embedding:', error);
		throw error;
	}
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
