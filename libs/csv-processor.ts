import fs from 'fs';
import csv from 'csv-parser';

export interface ProcessedCsvRow {
	id: string;
	text: string;
	type?: string;
	firstName?: string;
	lastName?: string;
	numImpressions: number;
	numViews: number;
	numReactions: number;
	numComments: number;
	numShares: number;
	createdAt?: string;
	link?: string;
	hashtags: string;
}

export function processCsv(filePath: string): Promise<ProcessedCsvRow[]> {
	return new Promise<ProcessedCsvRow[]>((resolve, reject) => {
		const results: ProcessedCsvRow[] = [];

		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', (data: Record<string, string>) => {
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
						hashtags: data.hashtags || '',
					});
				}
			})
			.on('end', () => {
				console.log(
					`Processed ${results.length} non-empty entries from CSV`
				);
				resolve(results);
			})
			.on('error', (error) => {
				reject(error);
			});
	});
}
