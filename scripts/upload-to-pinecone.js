import { upsertVectors } from '../libs/pinecone.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function uploadVectorsToPinecone() {
	try {
		const vectorsPath = path.join(
			process.cwd(),
			'output',
			'brian_posts_vectors.json',
		);

		if (!fs.existsSync(vectorsPath)) {
			throw new Error(`Vectors file not found at: ${vectorsPath}`);
		}

		console.log('Loading vectors from file...');
		const vectorsData = fs.readFileSync(vectorsPath, 'utf8');
		const vectors = JSON.parse(vectorsData);

		if (vectors.length === 0) {
			throw new Error('No vectors found in file');
		}

		const dimension = vectors[0].values.length;
		console.log(
			`Found ${vectors.length} vectors with dimension ${dimension}`,
		);

		const indexName = process.env.PINECONE_INDEX_NAME;

		console.log(`Uploading to Pinecone index: ${indexName}`);

		await upsertVectors(indexName, vectors);

		console.log('✅ Successfully uploaded all vectors to Pinecone!');
		console.log(
			`📊 Uploaded ${vectors.length} vectors to index '${indexName}'`,
		);
	} catch (error) {
		console.error('❌ Error uploading vectors:', error);
		process.exit(1);
	}
}

uploadVectorsToPinecone();
