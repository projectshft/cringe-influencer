import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

const pc = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY ?? '',
});

/**
 * @typedef {Object} VectorRecord
 * @property {string} id
 * @property {number[]} values
 * @property {Object} [metadata]
 */

/**
 * Upsert vectors to a Pinecone index
 * @param {string} indexName - Name of the Pinecone index
 * @param {VectorRecord[]} vectors - Array of vectors to upsert
 * @returns {Promise<void>}
 */
export async function upsertVectors(indexName, vectors) {
	try {
		const index = pc.index(indexName);

		const batchSize = 100;
		const batches = [];

		for (let i = 0; i < vectors.length; i += batchSize) {
			batches.push(vectors.slice(i, i + batchSize));
		}

		for (let i = 0; i < batches.length; i++) {
			const batch = batches[i];
			if (batch.length === 0) continue;

			let retries = 3;
			while (retries > 0) {
				try {
					await index.upsert({ records: batch });
					console.log(`Upserted batch ${i + 1}/${batches.length} (${batch.length} vectors)`);
					break;
				} catch (err) {
					retries--;
					if (retries === 0) throw err;
					console.log(`Retry batch ${i + 1} (${retries} attempts left)...`);
					await new Promise((r) => setTimeout(r, 1000));
				}
			}
		}

		console.log(
			`Successfully upserted ${vectors.length} vectors to ${indexName}`,
		);
	} catch (error) {
		console.error('Error upserting vectors to Pinecone:', error);
		throw error;
	}
}

/**
 * Query vectors from a Pinecone index
 * @param {string} indexName - Name of the Pinecone index
 * @param {number[]} vector - Query vector
 * @param {number} topK - Number of results to return (default: 10)
 * @param {boolean} includeMetadata - Whether to include metadata in results (default: true)
 * @returns {Promise<Array>} - Promise resolving to array of scored records
 */
export async function queryVectors(
	indexName,
	vector,
	topK = 10,
	includeMetadata = true,
) {
	try {
		const index = pc.index(indexName);

		const queryResponse = await index.query({
			vector,
			topK,
			includeMetadata,
		});

		return queryResponse.matches ?? [];
	} catch (error) {
		console.error('Error querying vectors from Pinecone:', error);
		throw error;
	}
}

