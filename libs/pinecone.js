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

		for (const batch of batches) {
			// The SDK accepts a broader input shape
			await index.upsert(batch);
		}

		console.log(
			`Successfully upserted ${vectors.length} vectors to ${indexName}`
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
	includeMetadata = true
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

/**
 * @typedef {Object} RerankInputDocument
 * @property {string} id
 * @property {string} text
 */

/**
 * Rerank documents using Pinecone's reranking capability
 * @param {string} query - The query to rerank against
 * @param {RerankInputDocument[]} documents - Documents to rerank
 * @param {number} topK - Number of top results to return (default: 5)
 * @returns {Promise<Object>} - Promise resolving to rerank result
 */
export async function rerank(query, documents, topK = 5) {
	try {
		const rerankedResponse = await pc.inference.rerank(
			'bge-reranker-v2-m3',
			query,
			// Ensure the object values are strings per Pinecone typings
			documents.map((doc) => ({
				id: String(doc.id),
				text: String(doc.text),
			})),
			{
				returnDocuments: true,
				topN: topK,
			}
		);

		return rerankedResponse;
	} catch (error) {
		console.error('Error reranking with Pinecone:', error);
		throw error;
	}
}
