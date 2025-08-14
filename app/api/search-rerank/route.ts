import { NextRequest, NextResponse } from 'next/server';
import { createEmbedding } from '../../../libs/openai';
import { queryVectors, rerank } from '../../../libs/pinecone';

export async function POST(request: NextRequest) {
	try {
		const { query, topK = 10 } = await request.json();

		const queryEmbedding = await createEmbedding(query, 512);

		const results = await queryVectors(
			'brian-clone',
			queryEmbedding,
			topK,
			true
		);

		const documents = results.map((match: any) => ({
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

		const rerankedResults = await rerank(query, documents, 5);

		const rerankedDocuments = rerankedResults.data.map((result: any) => {
			const originalDoc = documents[result.index];
			return {
				...originalDoc,
				rerankScore: result.score,
			};
		});

		return NextResponse.json({
			query,
			documents: rerankedDocuments,
			total: rerankedDocuments.length,
			reranked: true,
		});
	} catch (error) {
		console.error('Search with reranking error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
