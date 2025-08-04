import { CringeInfluencerRAG } from '../../index.js';
import { createCompletion } from '../../libs/openai.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;

  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Topic is required and must be a string' });
  }

  try {
    const rag = new CringeInfluencerRAG();
    const context = await rag.queryInBrianVoice(topic, 3);
    const prompt = rag.generatePromptInBrianVoice(topic, context);
    
    const generatedText = await createCompletion(prompt);

    res.status(200).json({ 
      topic,
      generatedText,
      context: context.map(c => ({ text: c.text, score: c.score }))
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
}