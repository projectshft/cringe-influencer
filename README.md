# Cringe Influencer RAG

A Next.js application that uses RAG (Retrieval Augmented Generation) to search through LinkedIn posts, create embeddings, and generate content in an authentic voice.

[Live Walkthrough Video](https://share.descript.com/view/JNWta1T8TKX)

## 🚀 Quick Start

### Prerequisites

-   Node.js (v22+)
-   Yarn package manager
-   OpenAI API key
-   Pinecone account (free tier available)

### Step 1: Clone and Install

```bash
git clone https://github.com/yourusername/cringe-influencer-rag.git
cd cringe-influencer-rag
yarn install
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Required for vector database
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name

# Required for OpenAI embeddings and search
OPENAI_API_KEY=your_openai_api_key
```

### Step 3: Set Up Pinecone (Free Tier)

1. Sign up at [Pinecone](https://www.pinecone.io/) (free tier includes 1 index)
2. Create a new index with these settings:
    - **Name**: Choose a name (use this as PINECONE_INDEX_NAME in .env)
    - **Dimensions**: 512 (for OpenAI text-embedding-3-small)
    - **Metric**: cosine
    - **Cloud**: Any region (e.g., aws/us-east-1)
3. Copy your API key from the Pinecone console to your .env file

### Step 4: Get OpenAI API Key

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to [API Keys](https://platform.openai.com/api-keys)
3. Create a new API key and copy it to your .env file
4. Add $5 credit to your account (OpenAI offers pay-as-you-go pricing)
    - Go to [Billing](https://platform.openai.com/account/billing/overview)
    - Click "Add to credit balance"
    - Add $5 (this is enough for thousands of embeddings and queries)

### Step 5: Upload Vectors to Pinecone

```bash
yarn upload
```

This uploads pre-generated vectors from `output/brian_posts_vectors.json` to your Pinecone index. Please use the correct index name.

### Step 6: Run the Application

```bash
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the application.

## 🔍 Using the Application

1. Enter a search query in the text area (e.g., "AI startup advice")
2. Click the SEARCH button
3. View results from both basic vector search and re-ranked results
4. Compare how the re-ranking improves search relevance

## 📁 Project Structure

-   `app/` - Next.js application files
    -   `api/` - API routes for search and re-ranking
    -   `components/` - React components
-   `data/` - Source data files
-   `libs/` - Utility libraries for OpenAI and Pinecone
-   `scripts/` - Scripts for embedding and uploading vectors
-   `output/` - Generated vector files

## 🛠️ Available Scripts

-   `yarn dev` - Start development server
-   `yarn build` - Build for production
-   `yarn start` - Start production server
-   `yarn embed` - Generate embeddings from source data
-   `yarn upload` - Upload vectors to Pinecone

## 📚 Learning Resources

For those interested in the technology behind this application:

-   [Essence of Linear Algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) - Visual introduction to vectors
-   [Neural Networks](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi) - How neural networks work
-   [Transformers, explained](https://www.youtube.com/watch?v=SZorAJ4I-sA) - Understanding the transformer architecture

## Join Parsity.io if you want to learn the skills to create production-grade full stack AI applications.
