'use server';

import { createEmbedding } from '../libs/openai';
import {
	queryVectors,
	rerank,
	type RerankInputDocument,
} from '../libs/pinecone';

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
	rerankScore?: number;
}

export interface SearchResult {
	query: string;
	documents: Document[];
	total: number;
	reranked?: boolean;
}

export async function basicSearch(
	query: string,
	topK: number = 5
): Promise<SearchResult> {
	try {
		const queryEmbedding = await createEmbedding(query, 512);

		const results = await queryVectors(
			'brian-clone',
			queryEmbedding,
			topK,
			true
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
		throw new Error('Search failed');
	}
}

export async function searchWithRerank(
	query: string,
	topK: number = 10
): Promise<SearchResult> {
	try {
		if (!query) {
			throw new Error('Query is required');
		}

		const queryEmbedding = await createEmbedding(query, 512);

		const results = await queryVectors(
			'brian-clone',
			queryEmbedding,
			topK,
			true
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

		const rerankDocuments: RerankInputDocument[] = documents.map((doc) => ({
			id: doc.id,
			text: doc.text,
		}));

		const rerankedResults = await rerank(query, rerankDocuments, 5);

		const rerankedDocuments: Document[] = rerankedResults.data.map(
			(result: any) => {
				const originalDoc = documents[result.index];
				return {
					...originalDoc,
					rerankScore: result.score,
				};
			}
		);

		return {
			query,
			documents: rerankedDocuments,
			total: rerankedDocuments.length,
			reranked: true,
		};
	} catch (error) {
		console.error('Search with reranking error:', error);
		throw new Error('Search with reranking failed');
	}
}
