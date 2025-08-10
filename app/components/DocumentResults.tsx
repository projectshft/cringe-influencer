interface Document {
  id: string;
  score: number;
  text: string;
  type?: string;
  firstName?: string;
  lastName?: string;
  numImpressions?: number;
  numViews?: number;
  numReactions?: number;
  numComments?: number;
  numShares?: number;
  createdAt?: string;
  link?: string;
  hashtags?: string;
}

interface DocumentResultsProps {
  documents: Document[];
  title: string;
  reranked?: boolean;
}

export default function DocumentResults({ documents, title, reranked = false }: DocumentResultsProps) {
  return (
    <div style={{ border: '2px solid #ccc', padding: '20px', margin: '20px 0', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ color: '#333', marginBottom: '15px' }}>
        {title} {reranked && <span style={{ color: '#e67e22', fontSize: '0.8em' }}>(WITH RERANKING)</span>}
      </h3>
      
      {documents.length === 0 ? (
        <p style={{ color: '#666' }}>No results found</p>
      ) : (
        documents.map((doc, index) => (
          <div 
            key={doc.id} 
            style={{ 
              border: '1px solid #999', 
              padding: '15px', 
              margin: '10px 0', 
              backgroundColor: 'white',
              borderRadius: '5px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                #{index + 1} - Score: {doc.score.toFixed(4)}
              </span>
              <span style={{ fontSize: '0.9em', color: '#666' }}>
                ID: {doc.id}
              </span>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Text:</strong>
              <p style={{ margin: '5px 0', lineHeight: '1.4', fontSize: '0.95em' }}>
                {doc.text.length > 300 ? doc.text.slice(0, 300) + '...' : doc.text}
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', fontSize: '0.85em', color: '#555' }}>
              {doc.firstName && doc.lastName && (
                <div><strong>Author:</strong> {doc.firstName} {doc.lastName}</div>
              )}
              {doc.type && (
                <div><strong>Type:</strong> {doc.type}</div>
              )}
              {doc.numImpressions && (
                <div><strong>Impressions:</strong> {doc.numImpressions.toLocaleString()}</div>
              )}
              {doc.numReactions && (
                <div><strong>Reactions:</strong> {doc.numReactions}</div>
              )}
              {doc.numComments && (
                <div><strong>Comments:</strong> {doc.numComments}</div>
              )}
              {doc.hashtags && (
                <div><strong>Hashtags:</strong> {doc.hashtags}</div>
              )}
            </div>
            
            {doc.link && (
              <div style={{ marginTop: '10px' }}>
                <a 
                  href={doc.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#3498db', textDecoration: 'underline', fontSize: '0.9em' }}
                >
                  View Original Post
                </a>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}