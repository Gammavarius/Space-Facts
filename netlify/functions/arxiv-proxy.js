import axios from "axios";

const BASE_URL = 'https://export.arxiv.org/api/query'
const keysArray = ['exoplanet', 'supernova', 'black+hole', 'galaxy', 'nebula', 'pulsar', 'quasar', 'dark+matter', 'gravitational+waves'];

exports.handler = async (event) => {
    const params = event.queryStringParameters || {};
    let key = params.search_query;

    if (!key) {
        const randomKey = Math.floor(Math.random() * keysArray.length);
        key = keysArray[randomKey];
    }
    const url = `${BASE_URL}?search_query=all:${encodeURIComponent(key)}&start=0&max_results=1`;

    try {
    const response = await axios.get(url);
    const data = await response.text();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/xml' },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch from arXiv' })
    };
  }
}