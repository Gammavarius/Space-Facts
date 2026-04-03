const MY_MEMORY_API_URL = 'https://api.mymemory.translated.net/get';

export async function translateText(text: string): Promise<string> {
    const trimmedText = text.trim();

    if(!trimmedText) {
        return trimmedText;
    }

    const url = `${MY_MEMORY_API_URL}?q=${encodeURIComponent(trimmedText)}&langpair=en|ru&de=blind.gammavarius@gmail.com`;

    try {
        const response = await fetch(url);
        console.log("Статус ответа translator:", response.status);

        if(!response.ok) {
            throw new Error (`HTTP error! status ${response.status}`);
        }

        const data = await response.json();
        return data.responseData.translatedText;
    } catch(error) {
        console.error("Ошибка при запросе перевода:", error);
        return text;
    }
}