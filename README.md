# Cringe Influencer RAG

Backend app that processes Brian's LinkedIn posts, creates embeddings, and generates vectors for Pinecone upload. Enables RAG-powered content generation in Brian's authentic voice.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and add your API keys:
```bash
cp .env.example .env
```

3. Process CSV and create embeddings:
```bash
npm run embed
```

4. Upload the generated `output/brian_posts_vectors.json` to your Pinecone index

## Usage

```javascript
import { CringeInfluencerRAG } from './index.js';

const rag = new CringeInfluencerRAG('your-pinecone-index');
const context = await rag.queryInBrianVoice('AI tools and productivity');
const prompt = rag.generatePromptInBrianVoice('AI in 2024', context);
```

## Structure

- `libs/` - OpenAI and Pinecone utilities
- `scripts/embed.js` - Main embedding script
- `output/` - Generated vector JSON files
- `index.js` - RAG class for querying and prompt generation