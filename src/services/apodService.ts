const APOD_PROXY_URL = '/.netlify/functions/apod-proxy';

export async function fetchApod(_date?: string) {
    const url = APOD_PROXY_URL;
    console.log('Запрашиваем через прокси apod:', url);

    try {
    const response = await fetch(url);
    console.log('Статус ответа:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Получены данные:', data);
    return data;
  } catch (error) {
    console.error('Ошибка при запросе:', error);
  }
}