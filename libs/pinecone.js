import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export async function upsertVectors(indexName, vectors) {
  try {
    const index = pc.index(indexName);
    
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < vectors.length; i += batchSize) {
      batches.push(vectors.slice(i, i + batchSize));
    }
    
    for (const batch of batches) {
      await index.upsert(batch);
    }
    
    console.log(`Successfully upserted ${vectors.length} vectors to ${indexName}`);
  } catch (error) {
    console.error('Error upserting vectors to Pinecone:', error);
    throw error;
  }
}

export async function queryVectors(indexName, vector, topK = 10, includeMetadata = true) {
  try {
    const index = pc.index(indexName);
    
    const queryResponse = await index.query({
      vector,
      topK,
      includeMetadata,
    });
    
    return queryResponse.matches;
  } catch (error) {
    console.error('Error querying vectors from Pinecone:', error);
    throw error;
  }
}

export async function rerank(query, documents, topK = 5) {
  try {
    const rerankedResponse = await pc.rerank({
      model: 'pinecone-rerank-v0',
      query,
      documents: documents.map(doc => ({ id: doc.id, text: doc.text })),
      topK
    });
    
    return rerankedResponse.data;
  } catch (error) {
    console.error('Error reranking with Pinecone:', error);
    throw error;
  }
}