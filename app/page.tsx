'use client';

import { useState } from 'react';
import DocumentResults from './components/DocumentResults';
import {
	basicSearch,
	searchWithRerank,
	type Document,
} from '../actions/search';

export default function Home() {
	const [query, setQuery] = useState('');
	const [loading, setLoading] = useState(false);
	const [basicResults, setBasicResults] = useState<Document[]>([]);
	const [rerankedResults, setRerankedResults] = useState<Document[]>([]);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		setLoading(true);
		setBasicResults([]);
		setRerankedResults([]);

		try {
			const [basicData, rerankedData] = await Promise.all([
				basicSearch(query, 5),
				searchWithRerank(query, 10),
			]);

			setBasicResults(basicData.documents || []);
			setRerankedResults(rerankedData.documents || []);
		} catch (error) {
			console.error('Search error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='container'>
			<h1>CRINGE INFLUENCER RAG</h1>
			<div className='separator'></div>

			<p>
				No fancy styling, just pure functionality. Compare basic vector
				search vs re-ranked results!
			</p>

			<h2>Features:</h2>
			<ul className='list'>
				<li className='list-item'>
					RAG-powered search through influencer posts
				</li>
				<li className='list-item'>
					Pinecone vector database integration
				</li>
				<li className='list-item'>OpenAI embeddings (512d)</li>
				<li className='list-item'>LLM-based re-ranking comparison</li>
				<li className='list-item'>Beautiful 1995-era styling</li>
			</ul>

			<div className='separator'></div>

			<h2>Search Interface:</h2>
			<form onSubmit={handleSearch} className='mb-4'>
				<div className='mb-2'>
					<textarea
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Search Brian posts... (e.g., "AI startup advice")'
						className='form-input w-full p-2'
						rows={3}
						style={{ resize: 'vertical', minHeight: '80px' }}
					></textarea>
				</div>
				<div>
					<button type='submit' className='btn' disabled={loading}>
						{loading ? 'SEARCHING...' : 'SEARCH'}
					</button>
				</div>
			</form>

			{loading && (
				<div style={{ padding: '20px', textAlign: 'center' }}>
					<p>🔍 Searching vectors and re-ranking results...</p>
				</div>
			)}

			<div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
				{basicResults.length > 0 && (
					<div style={{ flex: '1', minWidth: '400px' }}>
						<DocumentResults
							documents={basicResults}
							title='BASIC VECTOR SEARCH'
						/>
					</div>
				)}

				{rerankedResults.length > 0 && (
					<div style={{ flex: '1', minWidth: '400px' }}>
						<DocumentResults
							documents={rerankedResults}
							title='RE-RANKED RESULTS'
							reranked={true}
						/>
					</div>
				)}
			</div>

			<div className='separator'></div>

			<h3>How it works:</h3>
			<p style={{ fontSize: '0.9em', color: '#666', lineHeight: '1.5' }}>
				<strong>Basic Search:</strong> Creates embedding for your query,
				searches Pinecone for similar vectors, returns top 5 by cosine
				similarity.
				<br />
			</p>
		</div>
	);
}
