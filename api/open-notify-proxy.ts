import type { VercelRequest, VercelResponse } from '@vercel/node';

const OPEN_NOTIFY_URL = 'http://api.open-notify.org/astros.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const response = await fetch(OPEN_NOTIFY_URL);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from Open Notify' });
    }
}