import { createEmbeddings } from '../libs/openai.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const queries = [
	'Write a post about why AI is bad for learning to code',
	'Write a post on how to get a job as a junior developer',
	'Tell me the weather in france?',
];

async function main() {
	console.log('Generating embeddings for', queries.length, 'queries...');

	const embeddings = await createEmbeddings(queries, 1536);

	const cache = {};
	queries.forEach((q, i) => {
		cache[q] = embeddings[i];
	});

	const outputPath = path.join(process.cwd(), 'libs', 'query-cache.json');
	fs.writeFileSync(outputPath, JSON.stringify(cache, null, 2));

	console.log('Cache created at', outputPath);
}

main().catch(console.error);
