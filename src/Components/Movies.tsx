import React, { useEffect, useState, lazy, Suspense, useContext } from 'react';
import axios from 'axios';

// Local Modules
import AppContext from './AppContext';
import Spinner from './Spinner';
import MovieCarousel from './MovieCarousel';
// Lazy
const MovieHero = lazy(() => import('./MovieHero'));

// TS Props
interface Props {
    view: string;
    type: string;
    trailer: string;
    page?: number;
    year?: number;
    vote?: number;
    genreID?: number;
    genreText?: string;
    movieID?: string;
}

// <Movies /> Functional Component
const Movies: React.FC<Props> = ({
    view,
    type,
    trailer,
    page = 1,
    year = new Date().getFullYear(),
    vote = 5,
    genreID,
    genreText,
    movieID = '',
}: Props): React.ReactElement => {
    // TMDB API
    const apiKey: string | undefined = process.env.REACT_APP_TMDB_API_KEY;

    // Context
    const [dataStore, setDataStore] = useContext<any>(AppContext);

    // Destructure dataStore
    const {
        isActionVisible,
        isAllTimeVisible,
        isDocVisible,
        isAdventureVisible,
        isComVisible,
        isFamVisible,
        isAnimeVisible,
        isThrillVisible,
        isRomVisible,
        isDramaVisible,
        isMusicVisible,
        isCrimeVisible,
        isHistoVisible,
        isMysVisible,
        isHorVisible,
    } = dataStore;

    // States
    const [heroMovData, setHeroMovData] = useState<object | null | undefined>();
    const [upcomingMovData, setUpcomingMovData] = useState<object | null | undefined>();
    const [topTVData, setTopTVData] = useState<object | null | undefined>();
    const [topMovData, setTopMovData] = useState<object | null | undefined>();
    const [topRatedAllTimeData, setTopRatedAllTimeData] = useState<object | null | undefined>();
    const [actionData, setActionData] = useState<object | null | undefined>();
    const [docData, setDocData] = useState<object | null | undefined>();
    const [advenData, setAdvenData] = useState<object | null | undefined>();
    const [comData, setComData] = useState<object | null | undefined>();
    const [famData, setFamData] = useState<object | null | undefined>();
    const [animeData, setAnimeData] = useState<object | null | undefined>();
    const [thrillData, setThrillData] = useState<object | null | undefined>();
    const [romData, setRomData] = useState<object | null | undefined>();
    const [dramaData, setDramaData] = useState<object | null | undefined>();
    const [musicData, setMusicData] = useState<object | null | undefined>();
    const [crimeData, setCrimeData] = useState<object | null | undefined>();
    const [histoData, setHistoData] = useState<object | null | undefined>();
    const [mysData, setMysData] = useState<object | null | undefined>();
    const [horData, setHorData] = useState<object | null | undefined>();

    // API Endpoints
    const endpoints = {
        discover: `
        https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&
        sort_by=popularity.desc&include_adult=false&include_video=true&with_genres=
        ${genreID}&primary_release_year=${year}&vote_average.gte=${vote}&page=${page}
    `,
        discoverDef: `
        https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&
        sort_by=popularity.desc&include_adult=false&include_video=true&with_genres=
        ${genreID}&primary_release_year=${year}&vote_average.gte=${vote}&page=1
    `,
        topRatedAllTime: `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=${page}`,
        topRatedAllTimeDef: `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`,
        upcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=${page}`,
        upcomingDef: `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`,
        movieTrending: `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`,
        tvTrending: `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`,
    };

    // Default: Effects
    useEffect(() => {
        // Fetch for Upcoming Movies, Top Rated TV, and Top Movies (concurrently)
        axios
            .all([getUpcomingMovies(), getTopRatedTV(), getTopMovies()])
            .then(
                axios.spread(async (upcomingMov, topTV, topMov) => {
                    // Deconstructure and get the results array, use aliases
                    const {
                        data: { results: upcomingMovBase },
                    }: { data: object | any } = upcomingMov;
                    const {
                        data: { results: topTVBase },
                    }: { data: object | any } = topTV;
                    const {
                        data: { results: topMovBase },
                    }: { data: object | any } = topMov;

                    // Set states
                    await setUpcomingMovData(upcomingMovBase);
                    await setTopTVData(topTVBase);
                    await setTopMovData(topMovBase);

                    // Get and set the one highest rated movie for the MovieHero component
                    const featuredMovie = upcomingMovBase.find(feat => feat.popularity > 110);
                    // Just in case there is no movie above 100 rating
                    featuredMovie === undefined && upcomingMovBase.find(feat => feat.popularity < 90);
                    await setHeroMovData(featuredMovie);
                }),
            )
            .catch(e => console.log('Movies: Endpoint Error'));
    }, []);

    // Fetch these movies only if their carousels are visible
    useEffect(() => {
        if (isActionVisible) fetcher(endpoints.discover, setActionData, setDataStore, 'isActionVisible');
        if (isDocVisible) fetcher(endpoints.discover, setDocData, setDataStore, 'isDocVisible');
        if (isAdventureVisible) fetcher(endpoints.discover, setAdvenData, setDataStore, 'isAdventureVisible');
        if (isComVisible) fetcher(endpoints.discover, setComData, setDataStore, 'isComVisible');
        if (isFamVisible) fetcher(endpoints.discover, setFamData, setDataStore, 'isFamVisible');
        if (isAnimeVisible) fetcher(endpoints.discover, setAnimeData, setDataStore, 'isAnimeVisible');
        if (isThrillVisible) fetcher(endpoints.discover, setThrillData, setDataStore, 'isThrillVisible');
        if (isRomVisible) fetcher(endpoints.discover, setRomData, setDataStore, 'isRomVisible');
        if (isDramaVisible) fetcher(endpoints.discover, setDramaData, setDataStore, 'isDramaVisible');
        if (isMusicVisible) fetcher(endpoints.discover, setMusicData, setDataStore, 'isMusicVisible');
        if (isCrimeVisible) fetcher(endpoints.discover, setCrimeData, setDataStore, 'isCrimeVisible');
        if (isHistoVisible) fetcher(endpoints.discover, setHistoData, setDataStore, 'isHistoVisible');
        if (isMysVisible) fetcher(endpoints.discover, setMysData, setDataStore, 'isMysVisible');
        if (isHorVisible) fetcher(endpoints.discover, setHorData, setDataStore, 'isHorVisible');
        if (isAllTimeVisible)
            fetcher(endpoints.topRatedAllTime, setTopRatedAllTimeData, setDataStore, 'isAllTimeVisible');
    }, [dataStore]);

    // Default: For multiple (concurrent) HTTP request using Axios inside useEffect
    // this will load concurrently on page load
    const getUpcomingMovies = () => axios.get(endpoints.upcoming);
    const getTopRatedTV = () => axios.get(endpoints.tvTrending);
    const getTopMovies = () => axios.get(endpoints.movieTrending);

    // Will fetch movie sets based on genre
    const fetcher = (endpoint, container, set, key) => {
        axios
            .get(endpoint)
            .then(data => {
                // Deconstructure and get the results array
                const {
                    data: { results: movBase },
                }: { data: object | any } = data;

                // then set the specific state
                container(movBase);
            })
            .catch(e => console.log('Movies: Endpoint Error'));

        // Revert the state's visibility to false
        // So that the useEffect will run properly
        set({
            ...dataStore,
            [key]: false,
        });
    };

    // Will return the appropriate array of movies
    const whatData = d => {
        if (d === 'hero') return heroMovData;
        if (d === 'upcoming') return upcomingMovData;
        if (d === 'tvTrending') return topTVData;
        if (d === 'movieTrending') return topMovData;
        if (d === 'topRatedAllTime') return topRatedAllTimeData;
        if (d === 'discover' && genreText === 'Action') return actionData;
        if (d === 'discover' && genreText === 'Documentary') return docData;
        if (d === 'discover' && genreText === 'Adventure') return advenData;
        if (d === 'discover' && genreText === 'Comedy') return comData;
        if (d === 'discover' && genreText === 'Family') return famData;
        if (d === 'discover' && genreText === 'Anime') return animeData;
        if (d === 'discover' && genreText === 'Thriller') return thrillData;
        if (d === 'discover' && genreText === 'Romance') return romData;
        if (d === 'discover' && genreText === 'Drama') return dramaData;
        if (d === 'discover' && genreText === 'Music') return musicData;
        if (d === 'discover' && genreText === 'Crime') return crimeData;
        if (d === 'discover' && genreText === 'History') return histoData;
        if (d === 'discover' && genreText === 'Mystery') return mysData;
        if (d === 'discover' && genreText === 'Horror') return horData;
        return null;
    };

    // Return Hero or a Carousel
    return (
        <>
            {type === 'hero' ? (
                <Suspense fallback={<Spinner />}>
                    <MovieHero data={whatData(type)} />
                </Suspense>
            ) : (
                <MovieCarousel
                    data={whatData(type)}
                    view={view}
                    type={genreText !== undefined ? type + genreText : type}
                    trailerType={trailer}
                />
            )}
        </>
    );
};

export default Movies;
