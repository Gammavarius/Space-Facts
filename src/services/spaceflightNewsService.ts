const NEWS_BASE_URL = 'https://api.spaceflightnewsapi.net/v4/';

export async function fetchSpaceNews() {
    try{
        const newsUrl = `${NEWS_BASE_URL}articles/`;
        console.log('Запрашиваем статью:', newsUrl);

        const response = await fetch(newsUrl);
        console.log('Статус ответа: ', response.status);

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Получены данные: ", data);
        return data.results[0];
    } catch(error) {
        console.error('Ошибка при запросе: ', error);
        return null;
    }
}