const OPEN_NOTIFY_PROXY_URL = '/api/open-notify-proxy';

export async function fetchAstronauts() {
  console.log('Запрашиваем список космонавтов:', OPEN_NOTIFY_PROXY_URL);

  try {
    const response = await fetch(OPEN_NOTIFY_PROXY_URL);
    console.log('Статус ответа:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Получены данные:', data);
    return data;
  } catch (error) {
    console.error('Ошибка при запросе к Open Notify:', error);
    return null;
  }
}