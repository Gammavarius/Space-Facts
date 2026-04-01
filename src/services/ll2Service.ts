import { fetchLatestLaunch } from "./spacexService";

const LL2_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0';

export async function fetchRandomFact() {
    try {
        const response = await fetch(`${LL2_BASE_URL}/event/?limit=0`);

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Количество доступных фактов:", data.count);

        const randomOffset = Math.floor(Math.random() * data.count);

        const factResponse = await fetch(`${LL2_BASE_URL}/event/?limit=1&offset=${randomOffset}`);

        if(!factResponse.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fetchData = await factResponse.json();
        console.log('fetchData:', fetchData);
        console.log('results[0]:', fetchData.results?.[0]);
        return fetchData.results[0];
    } catch (error) {
        console.error('Ошибка в запросе к Ll2 (event): ', error);
        return null;
    }
    
}

export async function fetchLatestLl2Launch() {
    try {
        const response = await fetch(`${LL2_BASE_URL}/launch/?limit=1`);

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('data:', data);
        return data.results[0];
    } catch (error) {
        console.error('Ошибка в запросе к Ll2 (launch): ', error);
        return null;
    }
    
}