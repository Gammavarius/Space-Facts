import { useEffect, useState } from 'react';
import { db } from './firebase/config';
import type { IMainFact } from './types/ImainFact';
import type { IAstronautsResponse } from './types/Iastronaut';
import { fetchLatestLaunch } from './services/spacexService';
import { fetchAstronauts } from './services/openNotifyService';
import { fetchRandomFact, fetchLatestLl2Launch } from './services/ll2Service';
import { fetchSpaceNews } from './services/spaceflightNewsService';
import { fetchArxivFact } from './services/arxivService';
import { fetchApod } from './services/apodService';
import { translateText } from './services/translationService';
console.log('Firebase db:', db)

function App() {
  const [launch, setLaunch] = useState(null);
  const [astronauts, setAstronauts] = useState<IAstronautsResponse | null>(null);
  const [latestLl2Launch, setLatestLl2Launch] = useState(null);
  const [mainFact, setMainFact] = useState<IMainFact | null>(null);

  useEffect(() => {
    const loadFact = async() => {
      const apodData = await fetchApod();
      if(apodData) {
        const translatedTitle = await translateText(apodData.title);
        const translatedDescription = await translateText(apodData.explanation); 
        setMainFact({
          source: 'apod',
          titleOriginal: apodData.title,
          title: translatedTitle,
          descriptionOriginal: apodData.explanation,
          description: translatedDescription,
          image: apodData.url,
          date: apodData.date,
          url: apodData.url,
        });
        return;
      }

      const ll2Data = await fetchRandomFact();
      if(ll2Data) {
        const translatedTitle = await translateText(ll2Data.name);
        const translatedDescription = await translateText(ll2Data.description);
        setMainFact({
          source: 'll2',
          titleOriginal: ll2Data.name,
          title: translatedTitle,
          descriptionOriginal: ll2Data.description,
          description: translatedDescription,
          image: ll2Data.feature_image,
          date: ll2Data.last_updated,
          url: ll2Data.url,
        });
        return;
      }

      const newsData = await fetchSpaceNews();
      if(newsData) {
        const translatedTitle = await translateText(newsData.title);
        const translatedDescription = await translateText(newsData.summary);
        setMainFact({
          source: 'news',
          titleOriginal: newsData.title,
          title: translatedTitle,
          descriptionOriginal: newsData.summary,
          description: translatedDescription,
          image: newsData.image_url,
          date: newsData.published_at,
          url: newsData.url,
        });
        return;
      }

      const arxivData = await fetchArxivFact();
      if(arxivData) {
        const translatedTitle = await translateText(arxivData.title);
        const translatedDescription = await translateText(arxivData.summary);
        setMainFact({
          source: 'arxiv',
          titleOriginal: arxivData.title,
          title: translatedTitle,
          descriptionOriginal: arxivData.summary,
          description: translatedDescription,
          date: arxivData.published,
          url: arxivData.id,
        });
        return;
      }
      

      setMainFact(null);
    }
    loadFact();
    
    
    fetchAstronauts().then(astronautsData => {
      console.log('Астронавты в App:', astronautsData);
      if(astronautsData) {
      setAstronauts(astronautsData);
      }
    });

    fetchLatestLl2Launch().then(latestLl2LaunchData => {
      console.log('Запуски: ', latestLl2LaunchData);
        if(latestLl2LaunchData) {
          setLatestLl2Launch(latestLl2LaunchData);
        } else {
            fetchLatestLaunch().then(spacexData => {
              if (spacexData) {
              setLaunch(spacexData);
      }
    });
        }
    });
  }, []);
  
  console.log('Данные launch:', launch);

  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <h1>Загадочный космос</h1>
      <FactCard mainFact={mainFact}/>

      {astronauts && (
        <div>
          <h3>Сейчас на орбите: {astronauts.number} человек</h3>
          <ul>
            {astronauts.people.map(person => (
              <li key={person.name}>{person.name} - {person.craft}</li>
            ))}
          </ul>
       </div>
      )}

      <LaunchCard latestLl2Launch={latestLl2Launch} launch={launch} />

      <p>Здесь будет фото дня и странные факты</p>
    </div>
  )
}

interface IFactCardProps {
    mainFact: IMainFact | null;
}

function FactCard ({mainFact}: IFactCardProps) {
  const [isOriginal, setIsOriginal] = useState(false)
    if (!mainFact) return (
        <div>
          <p>Наши космические зонды пока не вернулись с данными. Возможно, их перехватила чёрная дыра. Подождите немного или попробуйте обновить страницу!</p>
        </div>
    )
    return (
      <div>
      {!isOriginal && (
        <div>
          <h3>{mainFact.title}</h3>
          {mainFact.image && (
            <img src={mainFact.image} alt={mainFact.title} style={{maxWidth: '200px'}} />
          )}
          <p>{mainFact.description}</p>
          <p>Дата: {new Date(mainFact.date).toLocaleDateString()}</p>
          <p>Статья переведена автоматически</p>
          <button type='button' onClick={() => setIsOriginal(!isOriginal)}>Показать оригинал</button>
        </div>
      )}
      {isOriginal && (
        <div>
          <h3>{mainFact.titleOriginal}</h3>
          {mainFact.image && (
            <img src={mainFact.image} alt={mainFact.titleOriginal} style={{maxWidth: '200px'}} />
          )}
          <p>{mainFact.descriptionOriginal}</p>
          <p>Date: {new Date(mainFact.date).toLocaleDateString()}</p>
          <button type='button' onClick={() => setIsOriginal(!isOriginal)}>Показать перевод</button>
        </div>
      )}
      </div>
    )
}

interface ILaunchCardProps {
  latestLl2Launch: any;
  launch: any;
}

function LaunchCard ({latestLl2Launch, launch}: ILaunchCardProps) {
  if (!latestLl2Launch && !launch) {
    return <p>Нет данных о запусках</p>;
  }
  
    return (
      <div>
        <h2>Последние запуски в космос</h2>
          {latestLl2Launch ? (
            <>
              <h3>{latestLl2Launch.name}</h3>
              <p>Дата запуска: {new Date(latestLl2Launch.net).toLocaleDateString()}</p>
              <p>Корабль: {latestLl2Launch.rocket?.configuration?.name || latestLl2Launch.rocket?.name || 'тайна'}</p>
              <p>Запуск осуществлялся: {latestLl2Launch.launch_service_provider?.name || 'тайна'}</p>
              <img src={latestLl2Launch?.image} alt={latestLl2Launch.name} style={{maxWidth: '200px'}} />
          </>
            ) : (
            <>
              <h3>{launch.name}</h3>
              <p>Дата: {new Date(launch.date_utc).toLocaleDateString()}</p>
              {launch.links?.patch?.small && (
              <img src={launch.links.patch.small} alt={launch.name} style={{maxWidth: '200px'}} />
            )}
            </>
            )}
      </div>
    );
}


export default App