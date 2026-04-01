import { useEffect, useState } from 'react';
import { db } from './firebase/config';
import { fetchLatestLaunch } from './services/spacexService';
import { fetchAstronauts } from './services/openNotifyService';
import { fetchRandomFact, fetchLatestLl2Launch } from './services/ll2Service';
import { fetchSpaceNews } from './services/spaceflightNewsService';
import { fetchArxivFact } from './services/arxivService';
import { fetchApod } from './services/apodService';
console.log('Firebase db:', db)

function App() {
  const [launch, setLaunch] = useState(null);
  const [astronauts, setAstronauts] = useState(null);
  const [latestLl2Launch, setLatestLl2Launch] = useState(null);
  const [factSource, setFactSource] = useState(null);
  const [mainFact, setMainFact] = useState(null);

  useEffect(() => {
    const loadFact = async() => {
      const ll2Data = await fetchRandomFact();
      if(ll2Data) {
        setMainFact(ll2Data);
        setFactSource('ll2');
        return;
      }
      const newsData = await fetchSpaceNews();
      if(newsData) {
        setMainFact(newsData);
        setFactSource('news');
        return;
      }
      const arxivData = await fetchArxivFact();
      if(arxivData) {
        setMainFact(arxivData);
        setFactSource('arxiv');
        return;
      }
      const apodData = await fetchApod();
      if(apodData) {
        setMainFact(apodData);
        setFactSource('apod');
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

      {/*{latestLl2Launch && (
        <div>
          <h2>Последние запуски в космос</h2>
          <h3>{latestLl2Launch.name}</h3>
          <p>Дата запуска: {new Date(latestLl2Launch.net).toLocaleDateString()}</p>
          <p>Корабль: {latestLl2Launch.rocket?.configuration?.name || latestLl2Launch.rocket?.name || 'тайна'}</p>
          <p>Запуск осуществлялся: {latestLl2Launch.launch_service_provider?.name || 'тайна'}</p>
          <img src={latestLl2Launch?.image} alt={latestLl2Launch.name} style={{maxWidth: '200px'}} />
        </div>
      )}

      {launch && (
        <div>
          <h2>{launch.name}</h2>
          <p>Дата: {new Date(launch.date_utc).toLocaleDateString()}</p>
          {launch.links?.patch?.small && (
            <img
              src={launch.links.patch.small}
              alt={launch.name}
              style={{maxWidth: '200px'}}
            />
          )}
        </div>
      )}*/}

      <p>Здесь будет фото дня и странные факты</p>
    </div>
  )
}

function FactCard ({factSource, mainFact}) {
    if (!mainFact) return (
        <div>
          <p>Наши космические зонды пока не вернулись с данными. Возможно, их перехватила чёрная дыра. Попробуйте обновить страницу!</p>
        </div>
    )
    if (factSource === 'll2') {
      return (
        <>
          <h3>{mainFact.name}</h3>
          <img 
            src={mainFact.feature_image} 
            alt={mainFact.name} 
            style={{ maxWidth: '200px', height: 'auto', objectFit: 'cover' }}
          />
          <p>{mainFact.description}</p>
          <p>Дата: {new Date(mainFact.last_updated).toLocaleDateString()}</p> 
        </>
      )}
    else if (factSource === 'news') {
      return (
        <>
          <h3>{mainFact.title}</h3>
          <img
            src={mainFact.image_url}
            alt={mainFact.title}
            style={{ maxWidth: '200px', height: 'auto', objectFit: 'cover' }}
          />
          <p>{mainFact.summary}</p>
          <p>Дата: {new Date(mainFact.published_at).toLocaleDateString()}</p>
        </>
      )} 
    else if (factSource === 'arxiv') {
      return (
        <>
          <h3>{mainFact.title}</h3>
          <p>Интересный факт: {mainFact.summary}</p>
          <p>Дата: {new Date(mainFact.published).toLocaleDateString()}</p>
        </>
      )
    } else if (factSource === 'apod') {
      return (
        <>
          <h3>{mainFact.title}</h3>
          <img
            src={mainFact.img}
            alt={mainFact.title}
            style={{ maxWidth: '200px', height: 'auto', objectFit: 'cover' }}
          />
          <p>Интересный факт: {mainFact.summary}</p>
          <p>Дата: {new Date(mainFact.published).toLocaleDateString()}</p>
        </>
      )
    }
}

function LaunchCard ({latestLl2Launch, launch}) {
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