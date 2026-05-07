/**
 * Cringe Influencer RAG - Main page component
 * Learn to build AI apps like this: https://parsity.io/ai-dev
 * Connect with me: https://linkedin.com/in/brianjenney
 */
'use client';

import { useState } from 'react';
import DocumentResults from './components/DocumentResults';
import { basicSearch, generatePost, type Document } from '../actions/search';

const SUGGESTED_QUERIES = [
	'Write a post about why AI is bad for learning to code',
	'Write a post on how to get a job as a junior developer',
	'Tell me the weather in france?',
];

export default function Home() {
	const [query, setQuery] = useState('');
	const [loading, setLoading] = useState(false);
	const [generating, setGenerating] = useState(false);
	const [results, setResults] = useState<Document[]>([]);
	const [generatedPost, setGeneratedPost] = useState('');

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		setLoading(true);
		setResults([]);
		setGeneratedPost('');

		try {
			const data = await basicSearch(query, 5);
			setResults(data.documents || []);
		} catch (error) {
			console.error('Search error:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleGenerate = async () => {
		if (results.length === 0) return;

		setGenerating(true);
		try {
			const context = results.map((doc) => doc.text);
			const post = await generatePost(query, context);
			setGeneratedPost(post);
		} catch (error) {
			console.error('Generation error:', error);
		} finally {
			setGenerating(false);
		}
	};

	return (
		<div className='container'>
			<h1>CRINGE INFLUENCER RAG</h1>
			<div className='separator'></div>

			<p>Search through LinkedIn posts using vector similarity!</p>

			<h2>Features:</h2>
			<ul className='list'>
				<li className='list-item'>
					RAG-powered search through influencer posts
				</li>
				<li className='list-item'>
					Pinecone vector database integration
				</li>
				<li className='list-item'>OpenAI embeddings (1536d)</li>
				<li className='list-item'>Gemini-powered post generation</li>
			</ul>

			<div className='separator'></div>

			<h2>Search Interface:</h2>
			<form onSubmit={handleSearch} className='mb-4'>
				<div className='mb-2'>
					<textarea
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Search posts... (e.g., "AI tools for coding")'
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

			<div style={{ marginBottom: '20px' }}>
				<p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
					Try these (cached - no API key needed):
				</p>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
					{SUGGESTED_QUERIES.map((suggestion) => (
						<button
							key={suggestion}
							onClick={() => setQuery(suggestion)}
							className='btn'
							style={{
								fontSize: '0.85em',
								padding: '8px 12px',
								backgroundColor: '#6c757d',
							}}
						>
							{suggestion.length > 40
								? suggestion.slice(0, 40) + '...'
								: suggestion}
						</button>
					))}
				</div>
			</div>

			{loading && (
				<div style={{ padding: '20px', textAlign: 'center' }}>
					<p>Searching vectors...</p>
				</div>
			)}

			{results.length > 0 && (
				<>
					<DocumentResults
						documents={results}
						title='SEARCH RESULTS'
					/>

					<div style={{ marginTop: '20px' }}>
						<button
							onClick={handleGenerate}
							className='btn'
							disabled={generating}
							style={{ backgroundColor: '#4CAF50' }}
						>
							{generating
								? 'GENERATING...'
								: 'GENERATE POST WITH GEMINI'}
						</button>
					</div>
				</>
			)}

			{generatedPost && (
				<div
					style={{
						border: '2px solid #4CAF50',
						padding: '20px',
						margin: '20px 0',
						backgroundColor: '#f0fff0',
					}}
				>
					<h3 style={{ color: '#2e7d32', marginBottom: '15px' }}>
						GENERATED POST
					</h3>
					<p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
						{generatedPost}
					</p>
				</div>
			)}

			<div className='separator'></div>

			<h3>How it works:</h3>
			<p style={{ fontSize: '0.9em', color: '#666', lineHeight: '1.5' }}>
				1. Search creates an embedding and finds similar posts via
				cosine similarity.
				<br />
				2. Generate uses those posts as context for Gemini to write a
				new post in the same style.
			</p>
		</div>
	);
}
