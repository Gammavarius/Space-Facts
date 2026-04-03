import type { VercelRequest, VercelResponse } from '@vercel/node';

const NASA_API_KEY = process.env.NASA_API_KEY || '';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const url = `${BASE_URL}?api_key=${NASA_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from NASA APOD' });
    }
}