import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_URL = 'https://export.arxiv.org/api/query';
const keysArray = ['exoplanet', 'supernova', 'black+hole', 'galaxy', 'nebula', 'pulsar', 'quasar', 'dark+matter', 'gravitational+waves'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { search_query } = req.query;
    let key = search_query as string;

    if (!key) {
        const randomKey = Math.floor(Math.random() * keysArray.length);
        key = keysArray[randomKey];
    }
    const url = `${BASE_URL}?search_query=all:${encodeURIComponent(key)}&start=0&max_results=1`;

    try {
        const response = await fetch(url);
        const data = await response.text();
        res.status(200).setHeader('Content-Type', 'application/xml').send(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from arXiv' });
    }
}
