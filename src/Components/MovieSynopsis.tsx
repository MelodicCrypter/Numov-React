import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ms from 'ms';
import { useQuery } from '@apollo/react-hooks';

// Local Modules
import Spinner from './Spinner';
import { LOCAL_MAIN_DEF_QUERY } from '../Utils/withApolloClient';
// Lazy
const NumovPlayer = lazy(() => import('./NumovPlayer'));

// TS Props
interface Props {
    type?: string;
}

// Styled Components
const SynopsisWrapper = styled.div`
    position: relative;
    background: #141414;
    width: 100%;
    min-height: 57vh;
    max-height: 100vh;
    height: 100%;
`;

const Title = styled.p`
    margin-top: 20px;
    font-size: 2rem;
    color: white;
    font-weight: 600;
    font-family: Roboto;
`;

const SynopsisText = styled.p`
    font-size: 1.1rem;
    color: #ababab;
    font-weight: 200;
    font-family: Nunito;
    margin-top: 10px;
`;

const PrevSynopsisText = styled.p`
    font-size: 1.1rem;
    color: white;
    font-weight: 200;
    font-family: Nunito;
    margin-top: 10px;
`;

const Para = styled.p`
    font-size: 0.8rem;
    color: #ababab;
`;

const PrevPara = styled.p`
    font-size: 0.8rem;
    color: white;
`;

const Bibo = styled.span`
    font-size: 0.8rem;
    color: #dfdfdf;
`;

const PrevBibo = styled.span`
    font-size: 0.6rem;
    color: white;
    font-weight: 300;
    border-radius: 2px;
    padding-left: 4px;
    margin-left: 0px;
`;

// <MovieSynopsis /> Functional Component
const MovieSynopsis: React.FC<Props> = (): React.ReactElement => {
    // Apollo Client - Query, querying default states
    const { data: localDefData } = useQuery(LOCAL_MAIN_DEF_QUERY, { fetchPolicy: 'cache-only' });

    // TMDB API
    const apiKey: string | undefined = process.env.REACT_APP_TMDB_API_KEY;

    // States
    const [movTrailerLinks, setMovTrailerLinks] = useState<Array<any>>([]);
    const [movInfo, setMovInfo] = useState<any>({});

    // Ref
    const synopRef: any = useRef();

    // The id of the movie that was clicked
    // and the identifier of the div wrapping it
    // it could be 'upcoming' 'tvTrending' and so on
    const { clickStat: movieID, trailerType, identifierWrapper } = localDefData;

    // Movie Endpoints
    const movieInfoEndpoint = `https://api.themoviedb.org/3/${
        trailerType === 'movie' ? 'movie' : 'tv'
    }/${movieID}?api_key=${apiKey}`;
    const trailerEndpoint = `https://api.themoviedb.org/3/${
        trailerType === 'movie' ? 'movie' : 'tv'
    }/${movieID}/videos?api_key=${apiKey}&language=en-US`;

    // Effects for traversing and loading the details of the selected movie
    useEffect(() => {
        if (movieID !== '') {
            trailerFetcher(trailerEndpoint, setMovTrailerLinks).catch(e => console.log('trailerFetcher: Error'));
            movieInfoFetcher(movieID, movieInfoEndpoint, setMovInfo).catch(e => console.log('movieFetcher: Error'));
        }
    }, [movieID]);

    // The actual API fetch for trailers
    const trailerFetcher = async (endpoint, setState) => {
        axios
            .get(endpoint)
            .then(async data => {
                // Deconstructure and get the results array
                const {
                    data: { results: movBase },
                }: { data: object | any } = data;

                // Temporary trailer links holder
                const tempLinksHolder: any = [];

                // Get trailer links of the currently clicked movie
                await movBase
                    .filter(m => {
                        return m.type === 'Trailer';
                    })
                    .map(d => {
                        tempLinksHolder.push(d.key);
                        return null;
                    });

                // Set state
                await setState(tempLinksHolder);
            })
            .catch(e => console.log('Fetcher 1 Endpoint Error'));
    };

    // The actual API fetch for specific movie details
    const movieInfoFetcher = async (id, endpoint, setState) => {
        if (id !== '') {
            axios
                .get(endpoint)
                .then(resp => {
                    // Deconstructure and get the results array
                    const { data }: { data: object | any } = resp;

                    const t = data.original_title || data.original_name;
                    const y = new Date(data.release_date).getFullYear() || new Date(data.last_air_date).getFullYear();
                    const s = data.seasons ? data.seasons.length : '';
                    const tvRntInt =
                        data.episode_run_time && data.episode_run_time.reduce((acc, current) => acc + current, 0);
                    const rntm = data.runtime !== undefined ? ms(ms(`${data.runtime}m`)) : ms(ms(`${tvRntInt}m`));

                    // Set state
                    setState({
                        genres: [...data.genres],
                        synopsis: data.overview,
                        rating: data.vote_average,
                        status: data.status,
                        duration: rntm,
                        title: t,
                        year: y,
                        seasons: s,
                    });
                })
                .catch(e => console.log('Fetcher 3 Endpoint Error'));
        }
    };

    return (
        <>
            <SynopsisWrapper
                key={new Date()}
                id="synopsis"
                ref={synopRef}
                className={`${identifierWrapper === 'preview' && 'prevOn'}`}
            >
                <div className="container">
                    <div className={`columns ${identifierWrapper !== 'preview' && 'is-desktop'}`}>
                        {identifierWrapper !== 'preview' && (
                            <div className="column auto">
                                {Object.keys(movInfo).length !== 0 && (
                                    <>
                                        <Title>{movInfo.title}</Title>
                                        <SynopsisText>
                                            {movInfo.synopsis.length > 400
                                                ? `${movInfo.synopsis.substring(0, 400)} ...`
                                                : movInfo.synopsis}
                                        </SynopsisText>

                                        <br />

                                        <ul id="synopsisBot1">
                                            <li>
                                                <Para>
                                                    Runtime: <Bibo> {movInfo.duration} &nbsp; </Bibo>
                                                </Para>
                                            </li>
                                            <li>
                                                <Para>
                                                    Rating: <Bibo> {movInfo.rating} &nbsp; </Bibo>
                                                </Para>
                                            </li>
                                            <li>
                                                <Para>
                                                    Year: <Bibo> {movInfo.year} &nbsp; </Bibo>
                                                </Para>
                                            </li>
                                            <li>
                                                {movInfo.seasons !== '' && (
                                                    <Para>
                                                        Seasons: <Bibo> {movInfo.seasons} &nbsp; </Bibo>
                                                    </Para>
                                                )}
                                            </li>
                                            <Para>
                                                Status: <Bibo> {movInfo.status} &nbsp; </Bibo>
                                            </Para>
                                        </ul>

                                        <span id="synopsisBot1Wrap">
                                            <Para>Genre: </Para>
                                            <ul id="synopsisBot1WrapCntx">
                                                {movInfo.genres !== undefined ? (
                                                    movInfo.genres.map(g => {
                                                        return (
                                                            <li key={g.id}>
                                                                <Bibo>{g.name}, </Bibo>
                                                            </li>
                                                        );
                                                    })
                                                ) : (
                                                    <></>
                                                )}
                                            </ul>
                                        </span>
                                    </>
                                )}
                            </div>
                        )}

                        {identifierWrapper === 'preview' && <div className="column"> </div>}

                        <div
                            className={`column ${
                                identifierWrapper === 'preview'
                                    ? 'auto is-four-fifths-tablet is-four-fifths-desktop'
                                    : 'is-three-fifths-desktop is-full-mobile is-full-tablet'
                            }`}
                        >
                            {movTrailerLinks !== undefined && movieID !== '' && (
                                <Suspense fallback={<Spinner />}>
                                    {movieID !== '' && (
                                        <div className={`${identifierWrapper === 'preview' && 'prev-trailer'}`}>
                                            <NumovPlayer trailID={movieID !== '' ? movTrailerLinks[0] : ''} />
                                        </div>
                                    )}
                                </Suspense>
                            )}

                            {identifierWrapper === 'preview' && Object.keys(movInfo).length !== 0 && (
                                <>
                                    <br />
                                    <Title>{movInfo.title}</Title>
                                    <PrevSynopsisText>{movInfo.synopsis}</PrevSynopsisText>

                                    <br />

                                    <ul id="synopsisBot2" className="prev-btm-1">
                                        <li>
                                            <PrevPara>
                                                Runtime:
                                                <PrevBibo>
                                                    <button className="button is-xsm is-greeny is-outlined">
                                                        {movInfo.duration}
                                                    </button>
                                                </PrevBibo>
                                            </PrevPara>
                                        </li>
                                        <li>
                                            <PrevPara>
                                                Rating:
                                                <PrevBibo>
                                                    <button className="button is-xsm is-greeny is-outlined">
                                                        {movInfo.rating}
                                                    </button>
                                                </PrevBibo>
                                            </PrevPara>
                                        </li>
                                        <li>
                                            <PrevPara>
                                                Year:
                                                <PrevBibo>
                                                    <button className="button is-xsm is-greeny is-outlined">
                                                        {movInfo.year}
                                                    </button>
                                                </PrevBibo>
                                            </PrevPara>
                                        </li>
                                        {/*<li>*/}
                                        {/*    {movInfo.seasons !== '' && (*/}
                                        {/*        <PrevPara>*/}
                                        {/*            Seasons:*/}
                                        {/*            <PrevBibo>*/}
                                        {/*                <button className="button is-xsm is-greeny is-outlined">*/}
                                        {/*                    {movInfo.seasons}*/}
                                        {/*                </button>*/}
                                        {/*            </PrevBibo>*/}
                                        {/*        </PrevPara>*/}
                                        {/*    )}*/}
                                        {/*</li>*/}
                                        <PrevPara>
                                            Status:
                                            <PrevBibo>
                                                <button className="button is-xsm is-greeny is-outlined">
                                                    {movInfo.status}
                                                </button>
                                            </PrevBibo>
                                            &nbsp;
                                        </PrevPara>
                                    </ul>

                                    <span id="synopsisBot2Wrap" className="prev-btm-2">
                                        <PrevPara>Genre: </PrevPara>
                                        <ul id="synopsisBot2WrapCntx">
                                            {movInfo.genres !== undefined ? (
                                                movInfo.genres.map(g => {
                                                    return (
                                                        <li key={g.id}>
                                                            <button className="button is-xsm is-cblue is-outlined">
                                                                <PrevBibo>{g.name}</PrevBibo>
                                                            </button>
                                                        </li>
                                                    );
                                                })
                                            ) : (
                                                <></>
                                            )}
                                        </ul>
                                    </span>
                                    <br />
                                </>
                            )}
                        </div>

                        {identifierWrapper === 'preview' && <div className="column"> </div>}
                    </div>
                </div>
            </SynopsisWrapper>
        </>
    );
};

export default MovieSynopsis;
