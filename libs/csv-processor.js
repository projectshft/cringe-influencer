import fs from 'fs';
import csv from 'csv-parser';

export function processCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        if (data.text && data.text.trim() !== '') {
          const cleanedText = data.text.replace(/\n/g, ' ').trim();
          
          results.push({
            id: data.urn || `post-${results.length}`,
            text: cleanedText,
            type: data.type,
            firstName: data.firstName,
            lastName: data.lastName,
            numImpressions: parseInt(data.numImpressions) || 0,
            numViews: parseInt(data.numViews) || 0,
            numReactions: parseInt(data.numReactions) || 0,
            numComments: parseInt(data.numComments) || 0,
            numShares: parseInt(data.numShares) || 0,
            createdAt: data['createdAt (TZ=America/Los_Angeles)'],
            link: data.link,
            hashtags: data.hashtags || ''
          });
        }
      })
      .on('end', () => {
        console.log(`Processed ${results.length} non-empty entries from CSV`);
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}