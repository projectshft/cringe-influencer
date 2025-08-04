import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      
      const data = await response.json()
      setResult(data.result || data.error)
    } catch (error) {
      setResult('Error occurred while searching')
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <Head>
        <title>Cringe Influencer RAG</title>
        <meta name="description" content="RAG app for LinkedIn posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          Cringe Influencer RAG
        </h1>

        <p className="description">
          Search through LinkedIn posts using AI embeddings
        </p>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
            className="search-input"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !query.trim()} className="search-button">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {result && (
          <div className="result">
            <h3>Result:</h3>
            <pre>{result}</pre>
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to bottom, #2e026d, #15162c);
        }

        .main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 800px;
          width: 100%;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
          color: white;
        }

        .description {
          margin: 4rem 0;
          line-height: 1.5;
          font-size: 1.5rem;
          text-align: center;
          color: #a1a1aa;
        }

        .search-form {
          display: flex;
          gap: 1rem;
          width: 100%;
          max-width: 600px;
          margin-bottom: 2rem;
        }

        .search-input {
          flex: 1;
          padding: 1rem;
          font-size: 1rem;
          border: 1px solid #374151;
          border-radius: 0.5rem;
          background: #1f2937;
          color: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .search-button {
          padding: 1rem 2rem;
          font-size: 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .search-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .search-button:disabled {
          background: #6b7280;
          cursor: not-allowed;
        }

        .result {
          width: 100%;
          max-width: 600px;
          background: #1f2937;
          border-radius: 0.5rem;
          padding: 1.5rem;
          color: white;
        }

        .result h3 {
          margin-top: 0;
          color: #3b82f6;
        }

        .result pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: inherit;
        }
      `}</style>
    </div>
  )
}