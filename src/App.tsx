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
console.log('Firebase db:', db)

function App() {
  const [launch, setLaunch] = useState(null);
  const [astronauts, setAstronauts] = useState<IAstronautsResponse | null>(null);
  const [latestLl2Launch, setLatestLl2Launch] = useState(null);
  const [factSource, setFactSource] = useState<'ll2' | 'news' | 'arxiv' | 'apod' | null>(null);
  const [mainFact, setMainFact] = useState<IMainFact | null>(null);

  useEffect(() => {
    const loadFact = async() => {
      const apodData = await fetchApod();
      if(apodData) {
        setMainFact({
          source: 'apod',
          title: apodData.title,
          description: apodData.explanation,
          image: apodData.url,
          date: apodData.date,
          url: apodData.url,
        });
        setFactSource('apod');
        return;
      }
      const ll2Data = await fetchRandomFact();
      if(ll2Data) {
        setMainFact({
          source: 'll2',
          title: ll2Data.name,
          description: ll2Data.description,
          image: ll2Data.feature_image,
          date: ll2Data.last_updated,
          url: ll2Data.url,
        });
        setFactSource('ll2');
        return;
      }
      const newsData = await fetchSpaceNews();
      if(newsData) {
        setMainFact({
          source: 'news',
          title: newsData.title,
          description: newsData.summary,
          image: newsData.image_url,
          date: newsData.published_at,
          url: newsData.url,
        });
        setFactSource('news');
        return;
      }
      const arxivData = await fetchArxivFact();
      if(arxivData) {
        setMainFact({
          source: 'arxiv',
          title: arxivData.title,
          description: arxivData.summary,
          date: arxivData.published,
          url: arxivData.id,
        });
        setFactSource('arxiv');
        return;
      }
      

      setMainFact(null);
      setFactSource(null);
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
      <FactCard factSource={factSource} mainFact={mainFact}/>

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
    factSource: 'll2' | 'news' | 'arxiv' | 'apod' | null;
    mainFact: IMainFact | null;
}

function FactCard ({mainFact}: IFactCardProps) {
    if (!mainFact) return (
        <div>
          <p>Наши космические зонды пока не вернулись с данными. Возможно, их перехватила чёрная дыра. Попробуйте обновить страницу!</p>
        </div>
    )
    return (
      <div>
        <h3>{mainFact.title}</h3>
        {mainFact.image && (
          <img src={mainFact.image} alt={mainFact.title} style={{maxWidth: '200px'}} />
        )}
        <p>{mainFact.description}</p>
        <p>Дата: {new Date(mainFact.date).toLocaleDateString()}</p>
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