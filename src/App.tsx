import { useEffect, useState } from 'react';
import { db } from './firebase/config';
import type { IMainFact } from './types/ImainFact';
import type { IAstronautsResponse } from './types/Iastronaut';
import type { ILl2Launch } from './types/ILl2Launch';
import type { ISpaceXLaunch } from './types/ISpaceXLaunch';
import { fetchLatestLaunch } from './services/spacexService';
import { fetchAstronauts } from './services/openNotifyService';
import { fetchRandomFact, fetchLatestLl2Launch } from './services/ll2Service';
import { fetchSpaceNews } from './services/spaceflightNewsService';
import { fetchArxivFact } from './services/arxivService';
import { fetchApod } from './services/apodService';
import { translateText } from './services/translationService';
console.log('Firebase db:', db)

function App() {
  const [launch, setLaunch] = useState<ISpaceXLaunch | null>(null);
  const [astronauts, setAstronauts] = useState<IAstronautsResponse | null>(null);
  const [latestLl2Launch, setLatestLl2Launch] = useState<ILl2Launch | null>(null);
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

    const starsContainer = document.createElement('div');
    starsContainer.id = 'stars-container';
    starsContainer.style.position = 'fixed';
    starsContainer.style.top = '0';
    starsContainer.style.left = '0';
    starsContainer.style.width = '100%';
    starsContainer.style.height = '100%';
    starsContainer.style.pointerEvents = 'none';
    starsContainer.style.zIndex = '-1';
    document.body.appendChild(starsContainer);

    for(let i = 0; i < 150; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.top = Math.random() * 100 + '%';
      star.style.left = Math.random() * 100 + '%';
      star.style.width = Math.random() *3 + 1 + 'px';
      star.style.height = star.style.width;
      star.style.animationDuration = Math.random() * 2 + 2 + 's';
      star.style.animationDelay = Math.random() * 5 + 's';
      starsContainer.appendChild(star);
    }

    const createFallingStar = ():void => {
      const star = document.createElement('div');
      star.className = 'falling-star';
      const startY: number = Math.random() * 30;
      star.style.top = startY + '%';
      star.style.left = Math.random() * 90 + 5 + '%';
      const dx: number = (Math.random() - 0.5) * 600;
      star.style.setProperty('--dx', dx + 'px');
      const dy: number = Math.random() * 70 + 30;
      star.style.setProperty('--dy', dy + 'vh');
      const duration: number = Math.random() * 2 + 1;
      star.style.animationDuration = duration + 's';
      document.body.appendChild(star);
      star.addEventListener('animationend', () => star.remove());
    }

    const fallingStarInterval = setInterval(():void => {
      if(Math.random() < 0.9) {
        createFallingStar();
      }
    }, 3000);
    
    return ():void => {
      clearInterval(fallingStarInterval);
      if(starsContainer) starsContainer.remove();
    }
    

  }, []);
  
  console.log('Данные launch:', launch);

  return (
    <div className='p-5 max-w-4xl mx-auto text-center'>
      <h1 className='text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8 mt-4'>Загадочный космос</h1>
      <div className="mt-4">
        <FactCard mainFact={mainFact} />
      </div>

      {astronauts && (
        <div className='bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-700 mt-8'>
          <h2 className='text-xl font-bold text-center mb-4 text-white'>Сейчас на орбите: {astronauts.number} человек</h2>
          <ul className='list-none pl-0 space-y-1 text-gray-200'>
            {astronauts.people.map(person => (
              <li key={person.name}>{person.name} - {person.craft}</li>
            ))}
          </ul>
       </div>
      )}
      <div className="mt-8">
        <LaunchCard latestLl2Launch={latestLl2Launch} launch={launch} />
      </div>
      <footer className='text-center text-gray-500 text-sm mt-12 pb-4'>
        © {new Date().getFullYear()} Данные предоставлены SpaceX API, LL2, Spaceflight News, arXiv, NASA APOD.
      </footer>
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
      <div className='bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border-gray-700 max-w-3xl mx-auto'>
      {!isOriginal && (
        <div>
          <h3 className='text-xl font-bold text-white mb-3'>{mainFact.title}</h3>
          {mainFact.image && (
            <img src={mainFact.image} alt={mainFact.title} className='max-w-[200px] h-auto mx-auto my-4 rounded lg shadow-md object-cover' />
          )}
          <p className='text-gray-200 leading-relaxed mb-3'>{mainFact.description}</p>
          <p className='text-sm text-gray-300 mb-2'>Дата: {new Date(mainFact.date).toLocaleDateString()}</p>
          <p className='text-xs text-gray-400 italic mb-4'>Статья переведена автоматически</p>
          <button type='button' 
                  onClick={() => setIsOriginal(!isOriginal)}
                  className='mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200'
                  >
                    Показать оригинал</button>
        </div>
      )}
      {isOriginal && (
        <div>
          <h3 className='text-xl font-bold text-white mb-3'>{mainFact.titleOriginal}</h3>
          {mainFact.image && (
            <img src={mainFact.image} alt={mainFact.titleOriginal} className='max-w-[200px] h-auto mx-auto my-4 rounded lg shadow-md object-cover' />
          )}
          <p className='text-gray-200 leading-relaxed mb-3'>{mainFact.descriptionOriginal}</p>
          <p className='text-sm text-gray-300 mb-2'>Date: {new Date(mainFact.date).toLocaleDateString()}</p>
          <button type='button' 
                  onClick={() => setIsOriginal(!isOriginal)}
                  className='mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200'
                  >
                    Показать перевод</button>
        </div>
      )}
      </div>
    )
}

interface ILaunchCardProps {
  latestLl2Launch: ILl2Launch | null;
  launch: ISpaceXLaunch | null;
}

function LaunchCard ({latestLl2Launch, launch}: ILaunchCardProps) {
  if (!latestLl2Launch && !launch) {
    return <p className='text-center text-gray-300'>Нет данных о запусках</p>;
  }
  
    return (
      <div className='bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-700 max-w-3xl mx-auto'>
        <h2 className='text-2xl font-bold text-center mb-6'>Последние запуски в космос</h2>
          {latestLl2Launch ? (
              <div className='text-center'>
                <h3 className='text-xl font-semibold mb-2'>{latestLl2Launch.name}</h3>
                <p className='text-gray-200 mb-1'>Дата запуска: {new Date(latestLl2Launch.net).toLocaleDateString()}</p>
                <p className='text-gray-200 mb-1'>Корабль: {latestLl2Launch.rocket?.configuration?.name || latestLl2Launch.rocket?.name || 'тайна'}</p>
                <p className='text-gray-200 mb-3'>Запуск осуществлялся: {latestLl2Launch.launch_service_provider?.name || 'тайна'}</p>
                <img src={latestLl2Launch?.image} alt={latestLl2Launch.name} className='mx-auto block rounded-lg max-w-[200px] h-auto object-cover' />
              </div>
            ) : (
              <div className='text-center'>
              <h3 className='text-xl font-semibold mb-2'>{launch.name}</h3>
              <p className='text-gray-200 mb-3'>Дата: {new Date(launch.date_utc).toLocaleDateString()}</p>
              {launch.links?.patch?.small && (
              <img src={launch.links.patch.small} alt={launch.name} className='mx-auto block rounded-lg shadow-md max-w-[200px]' />
              )}
            </div>
          )}
      </div>
    );
}


export default App