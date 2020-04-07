import React, { useEffect, useState } from 'react';
import Fade from 'react-reveal/Fade';
import ErrorBoundary from 'react-error-boundary';
import { useMediaQuery } from 'react-responsive';

// Local Modules
import AppContext from './AppContext';
import ErrorHandler from '../Utils/ErrorHandler';
import Movies from './Movies';
import getGenreId from '../Utils/getGenreId';
import MovieSynopsis from './MovieSynopsis';

// <Main /> Component
const Main: React.FC = (): React.ReactElement => {
    // Context destructure the Provider
    const { Provider } = AppContext;

    // Global States
    const [dataStore, setDataStore] = useState<any>({
        clickStat: '',
        identifierWrapper: '',
        trailerType: '',
        modalOn: false,
        isActionVisible: false,
        isAllTimeVisible: false,
        isDocVisible: false,
        isAdventureVisible: false,
        isComVisible: false,
        isFamVisible: false,
        isAnimeVisible: false,
        isThrillVisible: false,
        isRomVisible: false,
        isDramaVisible: false,
        isMusicVisible: false,
        isCrimeVisible: false,
        isHistoVisible: false,
        isMysVisible: false,
        isHorVisible: false,
    });
    const [visible, setVisible] = useState<boolean>(false);

    // Detect if custom-size is true
    const isMobTab = useMediaQuery({ minWidth: 0, maxWidth: 1360 });

    useEffect(() => {
        setTimeout(() => {
            setVisible(true);
            // This is not working...
            window.scrollTo(0, 0);
        }, 1000);
    }, []);

    return (
        <Provider value={[dataStore, setDataStore]}>
            <main>
                <ErrorBoundary onError={ErrorHandler}>
                    <section id="heroSection" className={`hero is-fullheight ${dataStore.modalOn && 'modald'}`}>
                        <Fade delay={20}>
                            <Movies view="hero" type="hero" trailer="movie" />
                        </Fade>
                    </section>

                    <section id="belowHeroSection" className={`container is-fullhd ${isMobTab && 'mobile'}`}>
                        <br />

                        <Fade delay={80}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Upcoming Movies</h2>
                            <Movies view="small" type="upcoming" trailer="movie" />
                        </Fade>
                        {dataStore.identifierWrapper === 'upcoming' && <MovieSynopsis />}

                        <br />

                        <Fade delay={80}>
                            <h2 className="list-heading special has-text-white has-text-weight-bold">
                                Top Rated TV Series (<em>This Week</em>)
                            </h2>
                            <Movies view="small" type="tvTrending" trailer="tv" />
                        </Fade>
                        {dataStore.identifierWrapper === 'tvTrending' && <MovieSynopsis />}

                        <br />

                        <Fade delay={80}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">
                                Top Movies (<em>This Week</em>)
                            </h2>
                            <Movies view="big" type="movieTrending" trailer="movie" />
                        </Fade>
                        {dataStore.identifierWrapper === 'movieTrending' && <MovieSynopsis />}

                        <br />

                        <Fade delay={10} onReveal={() => setDataStore({ ...dataStore, isAllTimeVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">
                                Top Rated Movies (<em>All Time</em>)
                            </h2>
                            <Movies view="small" type="topRatedAllTime" trailer="movie" />
                        </Fade>
                        {dataStore.identifierWrapper === 'topRatedAllTime' && <MovieSynopsis />}

                        <br />

                        {!visible ? (
                            <>
                                {[...Array(40).keys()].map(m => {
                                    return (
                                        <React.Fragment key={m}>
                                            <br />
                                        </React.Fragment>
                                    );
                                })}
                            </>
                        ) : (
                            <br />
                        )}

                        <Fade delay={10} onReveal={() => setDataStore({ ...dataStore, isActionVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Action</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Action')}
                                genreText="Action"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverAction' && <MovieSynopsis />}

                        <br />

                        <Fade delay={10} onReveal={() => setDataStore({ ...dataStore, isDocVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Documentary</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Documentary')}
                                genreText="Documentary"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverDocumentary' && <MovieSynopsis />}

                        <br />

                        <Fade delay={10} onReveal={() => setDataStore({ ...dataStore, isAdventureVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Adventure</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Adventure')}
                                genreText="Adventure"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverAdventure' && <MovieSynopsis />}

                        <br />

                        <Fade delay={100} onReveal={() => setDataStore({ ...dataStore, isComVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Comedy</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Comedy')}
                                genreText="Comedy"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverComedy' && <MovieSynopsis />}

                        <br />

                        <Fade delay={100} onReveal={() => setDataStore({ ...dataStore, isFamVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Family</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Family')}
                                genreText="Family"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverFamily' && <MovieSynopsis />}

                        <br />

                        <Fade delay={100} onReveal={() => setDataStore({ ...dataStore, isAnimeVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Anime</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Animation')}
                                genreText="Anime"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverAnime' && <MovieSynopsis />}

                        <br />

                        <Fade delay={10} onReveal={() => setDataStore({ ...dataStore, isThrillVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Thriller</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Thriller')}
                                genreText="Thriller"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverThriller' && <MovieSynopsis />}

                        <br />

                        <Fade delay={10} onReveal={() => setDataStore({ ...dataStore, isRomVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Romance</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Romance')}
                                genreText="Romance"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverRomance' && <MovieSynopsis />}

                        <br />

                        <Fade delay={10} onReveal={() => setDataStore({ ...dataStore, isDramaVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Drama</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Drama')}
                                genreText="Drama"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverDrama' && <MovieSynopsis />}

                        <br />

                        <Fade delay={10} onReveal={() => setDataStore({ ...dataStore, isMusicVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Music</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Music')}
                                genreText="Music"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverMusic' && <MovieSynopsis />}

                        <br />

                        <Fade delay={10} onReveal={() => setDataStore({ ...dataStore, isCrimeVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Crime</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Crime')}
                                genreText="Crime"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverCrime' && <MovieSynopsis />}

                        <br />

                        <Fade delay={10} onReveal={() => setDataStore({ ...dataStore, isHistoVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">History</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('History')}
                                genreText="History"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverHistory' && <MovieSynopsis />}

                        <br />

                        <Fade delay={10} onReveal={() => setDataStore({ ...dataStore, isMysVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Mystery</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Mystery')}
                                genreText="Mystery"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverMystery' && <MovieSynopsis />}

                        <br />

                        <Fade delay={10} onReveal={() => setDataStore({ ...dataStore, isHorVisible: true })}>
                            <h2 className="list-heading has-text-white has-text-weight-bold">Horror</h2>
                            <Movies
                                view="small"
                                type="discover"
                                genreID={getGenreId('Horror')}
                                genreText="Horror"
                                trailer="movie"
                            />
                        </Fade>
                        {dataStore.identifierWrapper === 'discoverHorror' && <MovieSynopsis />}

                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </section>
                </ErrorBoundary>
            </main>
        </Provider>
    );
};

export default Main;
