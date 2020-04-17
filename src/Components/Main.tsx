import React, { useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import ErrorBoundary from 'react-error-boundary';
import { useMediaQuery } from 'react-responsive';
import { useQuery, useMutation } from '@apollo/react-hooks';
import axios from 'axios';
import localforage from 'localforage';
import moment from 'moment';

// Local Modules
import { LOCAL_MAIN_DEF_QUERY, LOCAL_MOVIE_MUTATION, LOCAL_MOVIE_QUERY } from '../Utils/withApolloClient';
import ErrorHandler from '../Utils/ErrorHandler';
import getGenreId from '../Utils/getGenreId';
import MovieSynopsis from './MovieSynopsis';
import lfConfig from '../Utils/storeConfig';
import MovieCarouselSmall from './MovieCarouselSmall';
import MovieCarouselBig from './MovieCarouselBig';
import MovieHero from './MovieHero';

// <Main /> Component
const Main: React.FC = (): React.ReactElement => {
    // Apollo Client - Mutation, for toggles and movie data
    const [saveData] = useMutation(LOCAL_MOVIE_MUTATION);

    // Apollo Client - Query, querying default states
    const { data: localDefData } = useQuery(LOCAL_MAIN_DEF_QUERY, { fetchPolicy: 'cache-only' });
    const { data: localMovData } = useQuery(LOCAL_MOVIE_QUERY, { fetchPolicy: 'cache-only' });

    // Destructure the DEFAULT local states
    const { identifierWrapper, modalOn } = localDefData;
    // Destructure the MOVIE local states
    const {
        heroMovData,
        upcomingMovData,
        topTVData,
        topMovData,
        topRatedAllTimeData,
        actionData,
        docData,
        advenData,
        comData,
        famData,
        animeData,
        thrillData,
        romData,
        dramaData,
        musicData,
        crimeData,
        histoData,
        mysData,
        horData,
    } = localMovData;

    // Detect if custom-size is true
    const isMobTab = useMediaQuery({ minWidth: 0, maxWidth: 1360 });

    // TMDB API
    const apiKey: string | undefined = process.env.REACT_APP_TMDB_API_KEY;

    // API Endpoints
    const ep = {
        upcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US`,
        movieTrending: `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`,
        tvTrending: `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`,
    };

    // Localforage config
    lfConfig();

    // Default: Effects
    useEffect(() => {
        try {
            // This section is a bit tricky cause there are three endpoint concurrently sent
            // So in order to check if there is cached version for these three, we need to
            // check at least one key to be true (existing), if there is one, then for sure
            // all the other two data are present as well
            localforage
                .getItem('upcomingCached')
                .then(async cachedData => {
                    // If NO available cached API call, then fetch new one
                    if (await (cachedData === null)) {
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

                                    // Set Apollo's local states
                                    await saveData({
                                        variables: { type: 'upcomingMovData', movArray: upcomingMovBase },
                                    });
                                    await saveData({ variables: { type: 'topTVData', movArray: topTVBase } });
                                    await saveData({ variables: { type: 'topMovData', movArray: topMovBase } });

                                    // This is for Hero section of the app
                                    // Get and set the one highest rated movie for the MovieHero component
                                    const featuredMovie = upcomingMovBase.find(feat => feat.popularity > 110);
                                    // Just in case there is no movie above 100 rating
                                    featuredMovie === undefined && upcomingMovBase.find(feat => feat.popularity < 90);
                                    await saveData({ variables: { type: 'heroMovData', movArray: featuredMovie } });

                                    // save to localforage
                                    localforage.setItem('upcomingCached', upcomingMovBase).then();
                                    localforage.setItem('tvTrendingCached', topTVBase).then();
                                    localforage.setItem('movieTrendingCached', topMovBase).then();
                                    localforage.setItem('heroCached', featuredMovie).then();
                                }),
                            )
                            .catch(e => console.log('Movies: Endpoint Error'));
                    } else {
                        // Get all other cached movie data
                        const topTVBase = await localforage.getItem('tvTrendingCached');
                        const topMovBase = await localforage.getItem('movieTrendingCached');
                        const featuredMovie = await localforage.getItem('heroCached');

                        // Save to Apollo's local state
                        await saveData({ variables: { type: 'upcomingMovData', movArray: cachedData } });
                        await saveData({ variables: { type: 'topTVData', movArray: topTVBase } });
                        await saveData({ variables: { type: 'topMovData', movArray: topMovBase } });
                        await saveData({ variables: { type: 'heroMovData', movArray: featuredMovie } });
                    }
                })
                .catch(e => console.log('Main: Localspace Error - Main - in', e));
        } catch (e) {
            console.log('Main: Localspace Error - Main - out');
        }

        // Fire this event after 3 seconds, it will clear the cache if its passed 24 hours
        // The reason for the delay because localforage has some strange effect if clear()
        setTimeout(() => {
            try {
                localforage
                    .getItem('timeCheck')
                    .then(async t => {
                        // If time already cached, check if it is already passed 24 hrs
                        if (t !== null) {
                            // Delete all cached data after 24 hours
                            const yesterday = await moment(`${t}`);
                            const now = await moment();
                            const diff = await now.diff(yesterday, 'hours');
                            // Clear cache if passed 24 hours
                            if (diff > 23) {
                                await localforage.clear();
                            }
                        } else {
                            // Save the 'time' the user first used the ap
                            const startDate = await moment().format();
                            await localforage.setItem('timeCheck', startDate);
                        }
                    })
                    .catch(e => console.log('Main: Timecheck error - in'));
            } catch (e) {
                console.log('Main: Timecheck error - out');
            }
        }, 3000);
    }, []);

    // Default: For multiple (concurrent) HTTP request using Axios inside useEffect
    // this will load concurrently on page load
    const getUpcomingMovies = () => axios.get(ep.upcoming);
    const getTopRatedTV = () => axios.get(ep.tvTrending);
    const getTopMovies = () => axios.get(ep.movieTrending);

    // Will fetch movie sets based on genre
    const fetcher = (
        set: any,
        key: string,
        type: string,
        genText?: string,
        genreId?: number,
        year?: string,
        vote?: number,
        page?: number,
    ) => {
        // Defaults
        const gID = genreId !== undefined ? genreId : '';
        const y = year !== undefined ? year : new Date().getFullYear();
        const v = vote !== undefined ? vote : 5;
        const p = page !== undefined ? page : 1;
        // The API endpoint
        const endpoint =
            type === 'discover'
                ? `
            https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&
            sort_by=popularity.desc&include_adult=false&include_video=true&with_genres=
            ${gID}&primary_release_year=${y}&vote_average.gte=${v}&page=${p}`
                : `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=${p}`;

        // Build first the unique identiier, discoverAction, discoverDrama or custom
        const t = `${genText !== undefined ? type + genText : type}Cached`;

        // Check localforage first if API call alrady saved
        try {
            localforage
                .getItem(t)
                .then(async cachedData => {
                    // If NO available cached API call, then fetch new one
                    if (cachedData === null) {
                        axios
                            .get(endpoint)
                            .then(async data => {
                                // Deconstructure and get the results array
                                const {
                                    data: { results: movBase },
                                }: { data: object | any } = data;

                                // save to localforage
                                localforage.setItem(t, movBase).then();

                                // Save to Apollo's local state
                                await set({ variables: { type: key, movArray: movBase } });
                            })
                            .catch(e => console.log('Main: Endpoint - Fetcher - Error'));
                    } else {
                        // Save to Apollo's local state
                        await set({ variables: { type: key, movArray: cachedData } });
                    }
                })
                .catch(e => console.log('Main: Localspace Error - Fetcher - in', e));
        } catch (e) {
            console.log('Main: Localspace Error - Fetcher - out');
        }
    };

    return (
        <main>
            <ErrorBoundary onError={ErrorHandler}>
                <section id="heroSection" className={`hero is-fullheight ${modalOn && 'modald'}`}>
                    <Fade delay={30}>
                        <MovieHero data={heroMovData} />
                    </Fade>
                </section>

                <section id="belowHeroSection" className={`container is-fullhd ${isMobTab && 'mobile'}`}>
                    <br />

                    <Fade delay={30}>
                        <h2 className="list-heading has-text-white has-text-weight-bold">Upcoming Movies</h2>
                        <MovieCarouselSmall data={upcomingMovData} type="upcoming" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'upcoming' && <MovieSynopsis />}

                    <br />

                    <Fade delay={30}>
                        <h2 className="list-heading special has-text-white has-text-weight-bold">
                            Top Rated TV Series (<em>This Week</em>)
                        </h2>
                        <MovieCarouselSmall data={topTVData} type="tvTrending" trailerType="tv" />
                    </Fade>
                    {identifierWrapper === 'tvTrending' && <MovieSynopsis />}

                    <br />

                    <Fade delay={30}>
                        <h2 className="list-heading has-text-white has-text-weight-bold">
                            Top Movies (<em>This Week</em>)
                        </h2>
                        <MovieCarouselBig data={topMovData} type="movieTrending" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'movieTrending' && <MovieSynopsis />}

                    <br />

                    <Fade delay={30} onReveal={() => fetcher(saveData, 'topRatedAllTimeData', 'topRatedAllTime')}>
                        <h2 className="list-heading has-text-white has-text-weight-bold">
                            Top Rated Movies (<em>All Time</em>)
                        </h2>
                        <MovieCarouselSmall data={topRatedAllTimeData} type="topRatedAllTime" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'topRatedAllTime' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={30}
                        onReveal={() => fetcher(saveData, 'actionData', 'discover', 'Action', getGenreId('Action'))}
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Action</h2>
                        <MovieCarouselSmall data={actionData} type="discoverAction" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverAction' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() =>
                            fetcher(saveData, 'docData', 'discover', 'Documentary', getGenreId('Documentary'))
                        }
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Documentary</h2>
                        <MovieCarouselSmall data={docData} type="discoverDocumentary" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverDocumentary' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() =>
                            fetcher(saveData, 'advenData', 'discover', 'Adventure', getGenreId('Adventure'))
                        }
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Adventure</h2>
                        <MovieCarouselSmall data={advenData} type="discoverAdventure" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverAdventure' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() => fetcher(saveData, 'comData', 'discover', 'Comedy', getGenreId('Comedy'))}
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Comedy</h2>
                        <MovieCarouselSmall data={comData} type="discoverComedy" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverComedy' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() => fetcher(saveData, 'famData', 'discover', 'Family', getGenreId('Family'))}
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Family</h2>
                        <MovieCarouselSmall data={famData} type="discoverFamily" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverFamily' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() =>
                            fetcher(saveData, 'animeData', 'discover', 'Animation', getGenreId('Animation'))
                        }
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Animation</h2>
                        <MovieCarouselSmall data={animeData} type="discoverAnime" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverAnime' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() => fetcher(saveData, 'thrillData', 'discover', 'Thriller', getGenreId('Thriller'))}
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Thriller</h2>
                        <MovieCarouselSmall data={thrillData} type="discoverThriller" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverThriller' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() => fetcher(saveData, 'romData', 'discover', 'Romance', getGenreId('Romance'))}
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Romance</h2>
                        <MovieCarouselSmall data={romData} type="discoverRomance" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverRomance' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() => fetcher(saveData, 'dramaData', 'discover', 'Drama', getGenreId('Drama'))}
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Drama</h2>
                        <MovieCarouselSmall data={dramaData} type="discoverDrama" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverDrama' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() => fetcher(saveData, 'musicData', 'discover', 'Music', getGenreId('Music'))}
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Music</h2>
                        <MovieCarouselSmall data={musicData} type="discoverMusic" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverMusic' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() => fetcher(saveData, 'crimeData', 'discover', 'Crime', getGenreId('Crime'))}
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Crime</h2>
                        <MovieCarouselSmall data={crimeData} type="discoverCrime" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverCrime' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() => fetcher(saveData, 'histoData', 'discover', 'History', getGenreId('History'))}
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">History</h2>
                        <MovieCarouselSmall data={histoData} type="discoverHistory" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverHistory' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() => fetcher(saveData, 'mysData', 'discover', 'Mystery', getGenreId('Mystery'))}
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Mystery</h2>
                        <MovieCarouselSmall data={mysData} type="discoverMystery" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverMystery' && <MovieSynopsis />}

                    <br />

                    <Fade
                        delay={50}
                        onReveal={() => fetcher(saveData, 'horData', 'discover', 'Horror', getGenreId('Horror'))}
                    >
                        <h2 className="list-heading has-text-white has-text-weight-bold">Horror</h2>
                        <MovieCarouselSmall data={horData} type="discoverHorror" trailerType="movie" />
                    </Fade>
                    {identifierWrapper === 'discoverHorror' && <MovieSynopsis />}

                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </section>

                <section className="container">
                    <div className="columns">
                        <div className="column"></div>
                        <div className="column has-text-centered">
                            <figure className="image is-48x48 container">
                                <a href="https://github.com/MelodicCrypter" rel="noopener noreferrer" target="_blank">
                                    <img src="/img/icon.png" alt="Numov by Melodic Crypter - Hugh Caluscusin" />
                                </a>
                            </figure>
                        </div>
                        <div className="column"></div>
                    </div>
                </section>

                <br />
                <br />
                <br />
            </ErrorBoundary>
        </main>
    );
};

export default Main;
