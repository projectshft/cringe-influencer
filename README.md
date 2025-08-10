# Cringe Influencer RAG

Backend app that processes Brian's LinkedIn posts, creates embeddings, and generates vectors for Pinecone upload. Enables RAG-powered content generation in Brian's authentic voice.

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Create a Pinecone vector database:
   - Sign up at [Pinecone](https://www.pinecone.io/)
   - Create a new index with:
     - **Dimensions**: 512 (OpenAI text-embedding-3-small)
     - **Metric**: cosine
     - **Cloud**: Any region

3. Copy `.env.example` to `.env` and add your keys:
```bash
cp .env.example .env
```
Add your Pinecone API key and index name. You'll need an OpenAI API key for querying (not for the pre-generated vectors).

4. Upload pre-generated vectors to avoid using your OpenAI credits:
```bash
node scripts/upload-to-pinecone.js
```
This uploads the already-generated `output/brian_posts_vectors.json` to your Pinecone index.

## Usage

```javascript
import { CringeInfluencerRAG } from './index.js';

// Initialize with your Pinecone index name
const rag = new CringeInfluencerRAG('your-pinecone-index-name');

// Query for relevant content (uses OpenAI for query embedding)
const context = await rag.queryInBrianVoice('AI tools and productivity');

// Generate a prompt in Brian's voice
const prompt = rag.generatePromptInBrianVoice('AI in 2024', context);
console.log(prompt);
```

## Structure

- `libs/` - OpenAI and Pinecone utilities
- `scripts/embed.js` - Main embedding script
- `output/` - Generated vector JSON files
- `index.js` - RAG class for querying and prompt generation

## Future Improvements

This implementation provides a foundational RAG system but several areas could be enhanced:

### Chunking Strategies
- **Document Pipeline**: Implement automated systems to continuously ingest and chunk new content
- **Dynamic Chunking**: Explore semantic chunking vs fixed-size chunking for better retrieval accuracy
- **Chunk Overlap**: Add configurable overlap between chunks to maintain context continuity

### Query Enhancement
- **Query Preprocessing**: Extract key concepts and entities from user queries before vector search
- **Query Expansion**: Use synonyms and related terms to improve retrieval coverage
- **Intent Recognition**: Classify query types to apply different retrieval strategies

### Embedding Optimization
- **Embedding Models**: Experiment with different embedding dimensions beyond the current 512
- **Fine-tuning**: Train domain-specific embeddings on Brian's writing style
- **Multi-model Embeddings**: Compare OpenAI, Sentence Transformers, and other embedding approaches

### Re-ranking and Retrieval
- **Why Re-rank?**: After initial vector similarity search, re-ranking uses different signals (cross-attention, semantic relevance) to improve result quality
- **Hybrid Search**: Combine vector similarity with keyword matching for better precision
- **Result Diversity**: Ensure retrieved chunks cover different aspects of the query

### Vector Management
- **Incremental Updates**: Handle new content without full re-indexing
- **Version Control**: Track document changes and update corresponding vectors
- **Data Freshness**: Implement strategies for keeping embeddings current with evolving content

These improvements would transform this proof-of-concept into a production-ready system capable of handling dynamic content and complex queries.