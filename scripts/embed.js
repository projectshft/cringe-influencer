import { processCsv } from '../libs/csv-processor.js';
import { createEmbeddings } from '../libs/openai.js';
import fs from 'fs';
import path from 'path';

async function main() {
	try {
		console.log('Processing CSV file...');
		const csvPath = '../mini_rag/app/data/brian_posts.csv';
		const posts = await processCsv(csvPath);

		console.log(`Found ${posts.length} valid posts`);

		console.log('Creating embeddings...');
		const texts = posts.map((post) => post.text);
		const embeddings = await createEmbeddings(texts, 512);

		console.log('Preparing vectors for Pinecone...');
		const vectors = posts.map((post, index) => ({
			id: post.id,
			values: embeddings[index],
			metadata: {
				text: post.text,
				type: post.type,
				firstName: post.firstName,
				lastName: post.lastName,
				numImpressions: post.numImpressions,
				numViews: post.numViews,
				numReactions: post.numReactions,
				numComments: post.numComments,
				numShares: post.numShares,
				createdAt: post.createdAt,
				link: post.link,
				hashtags: post.hashtags,
			},
		}));

		const outputPath = path.join(
			process.cwd(),
			'output',
			'brian_posts_vectors.json'
		);

		console.log('Saving vectors to JSON file...');
		fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2));

		console.log(`✅ Successfully created ${vectors.length} vectors`);
		console.log(`📁 Saved to: ${outputPath}`);
		console.log('Ready for Pinecone upload!');
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

main();
