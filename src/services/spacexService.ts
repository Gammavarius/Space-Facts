const BASE_URL = 'https://api.spacexdata.com/v4';

export async function fetchLatestLaunch() {
    const url = `${BASE_URL}/launches/latest`;
    console.log('Запрашиваем последний запуск SpaceX:', url);

    try {
    const response = await fetch(url);
    console.log('Статус ответа:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Получены данные:', data);
    console.log('✅ Данные успешно получены и возвращаются');
    return data;
  } catch (error) {
    console.error('Ошибка при запросе:', error);
    return null;
  }
}