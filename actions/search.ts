'use server';

import { createEmbedding } from '../libs/openai';
import { queryVectors } from '../libs/pinecone';
import { generateText } from '../libs/gemini';

export interface Document {
	id: string;
	score: number;
	text: string;
	type?: string;
	firstName?: string;
	lastName?: string;
	numImpressions?: number;
	numViews?: number;
	numReactions?: number;
	numComments?: number;
	numShares?: number;
	createdAt?: string;
	link?: string;
	hashtags?: string;
}

export interface SearchResult {
	query: string;
	documents: Document[];
	total: number;
}

export async function basicSearch(
	query: string,
	topK: number = 5,
): Promise<SearchResult> {
	try {
		const queryEmbedding = await createEmbedding(query, 1536);

		const results = await queryVectors(
			process.env.PINECONE_INDEX_NAME || 'linkedin-posts',
			queryEmbedding,
			topK,
			true,
		);

		const documents: Document[] = results.map((match: any) => ({
			id: match.id,
			score: match.score,
			text: match.metadata?.text || 'No text available',
			type: match.metadata?.type,
			firstName: match.metadata?.firstName,
			lastName: match.metadata?.lastName,
			numImpressions: match.metadata?.numImpressions,
			numViews: match.metadata?.numViews,
			numReactions: match.metadata?.numReactions,
			numComments: match.metadata?.numComments,
			numShares: match.metadata?.numShares,
			createdAt: match.metadata?.createdAt,
			link: match.metadata?.link,
			hashtags: match.metadata?.hashtags,
		}));

		return {
			query,
			documents,
			total: documents.length,
		};
	} catch (error) {
		console.error('Search error:', error);
		throw error;
	}
}

export async function generatePost(
	query: string,
	context: string[],
): Promise<string> {
	const contextText = context.join('\n\n---\n\n');
	const prompt = `You are writing a LinkedIn post in the style of the examples below.

Topic: ${query}

Example posts for style reference:
${contextText}

Write a new LinkedIn post about the topic above, matching the voice and style of the examples. Keep it authentic and conversational.`;

	return generateText(prompt);
}
