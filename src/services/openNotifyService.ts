const ASTROS_URL = 'http://api.open-notify.org/astros.json';

export async function fetchAstronauts() {
  console.log('Запрашиваем список космонавтов:', ASTROS_URL);

  try {
    const response = await fetch(ASTROS_URL);
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