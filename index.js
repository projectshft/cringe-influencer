import { processCsv } from './libs/csv-processor.js';
import { createEmbedding } from './libs/openai.js';
import { queryVectors } from './libs/pinecone.js';
import dotenv from 'dotenv';

dotenv.config();

export class CringeInfluencerRAG {
  constructor(indexName = 'brian-posts') {
    this.indexName = indexName;
  }

  async queryInBrianVoice(query, topK = 5) {
    try {
      const queryEmbedding = await createEmbedding(query);
      const matches = await queryVectors(this.indexName, queryEmbedding, topK);
      
      return matches.map(match => ({
        score: match.score,
        text: match.metadata.text,
        type: match.metadata.type,
        engagement: {
          impressions: match.metadata.numImpressions,
          views: match.metadata.numViews,
          reactions: match.metadata.numReactions,
          comments: match.metadata.numComments
        },
        createdAt: match.metadata.createdAt,
        link: match.metadata.link
      }));
    } catch (error) {
      console.error('Error querying RAG:', error);
      throw error;
    }
  }

  generatePromptInBrianVoice(topic, context) {
    const contextText = context.map(c => c.text).join('\n\n');
    
    return `Based on Brian's writing style and voice from his LinkedIn posts, write about "${topic}".

Context from Brian's previous posts:
${contextText}

Write in Brian's authentic voice - direct, sometimes cynical about tech hype, but genuinely excited about practical applications. Keep his tone of being realistic about AI tools while acknowledging their value.`;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Cringe Influencer RAG initialized');
  console.log('Use: npm run embed to process CSV and create vectors');
  console.log('Then upload the vectors to Pinecone and use the RAG class for queries');
}