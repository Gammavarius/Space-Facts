const BASE_URL = 'https://api.nasa.gov/planetary/apod';
const NASA_API_KEY = process.env.NASA_API_KEY;

exports.handler = async(event) => {
    const url = `${BASE_URL}?api_key=${NASA_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Failed to fetch from NASA APOD'})
        };
    }
};