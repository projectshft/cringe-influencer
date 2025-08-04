import { CringeInfluencerRAG } from '../../index.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required and must be a string' });
  }

  try {
    const rag = new CringeInfluencerRAG();
    const results = await rag.queryInBrianVoice(query, 5);
    
    const formattedResults = results.map(result => ({
      score: result.score,
      text: result.text,
      type: result.type,
      engagement: result.engagement,
      createdAt: result.createdAt,
      link: result.link
    }));

    res.status(200).json({ 
      query,
      results: formattedResults,
      count: formattedResults.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
}