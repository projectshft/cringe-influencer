import {
	Pinecone,
	RecordMetadata,
	ScoredPineconeRecord,
} from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

const pc = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY ?? '',
});

export interface VectorRecord {
	id: string;
	values: number[];
	metadata?: Record<string, unknown>;
}

export async function upsertVectors(
	indexName: string,
	vectors: VectorRecord[],
): Promise<void> {
	try {
		const index = pc.index(indexName);

		const batchSize = 100;
		const batches: VectorRecord[][] = [];

		for (let i = 0; i < vectors.length; i += batchSize) {
			batches.push(vectors.slice(i, i + batchSize));
		}

		for (let i = 0; i < batches.length; i++) {
			const batch = batches[i];
			if (batch.length === 0) continue;

			let retries = 3;
			while (retries > 0) {
				try {
					await index.upsert({ records: batch as unknown as any });
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

export async function queryVectors(
	indexName: string,
	vector: number[],
	topK: number = 10,
	includeMetadata: boolean = true,
): Promise<ScoredPineconeRecord<RecordMetadata>[]> {
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

