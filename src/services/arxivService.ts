    const ARXIV_PROXY_URL = '/api/arxiv-proxy';

    export async function fetchArxivFact() {
        try {
            const factUrl = ARXIV_PROXY_URL;
            console.log('Запрашиваем статью arxiv через прокси:', factUrl);

            const response = await fetch(factUrl);
            console.log('Статус ответа arxiv: ', response.status);

            if(!response.ok) {
                throw new Error(`HTTP server error! status: ${response.status}`);
            }

            const xmlText = await response.text();
            const parser = new DOMParser;
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
            const entry = xmlDoc.querySelector('entry');

            if(!entry) {
                return null;
            }

            const title = entry.querySelector('title')?.textContent || '';
            const summary = entry.querySelector('summary')?.textContent || '';
            const published = entry.querySelector('published')?.textContent || '';
            const id = entry.querySelector('id')?.textContent || '';

            console.log("Получены данные arxiv: ", title, summary, published);
            return {title, summary, published, id}
        } catch (error) {
            console.error('Ошибка в запросе к серверу arxiv: ', error);
            return null;
        }
    }