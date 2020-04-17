import React from 'react';
import styled from 'styled-components';
import { IoLogoYoutube } from 'react-icons/io';
import { useMediaQuery } from 'react-responsive';
import Fade from 'react-reveal/Fade';
import { useQuery, useMutation } from '@apollo/react-hooks';

// Local Modules
import MoviePreview from './MoviePreview';
import { LOCAL_MAIN_DEF_QUERY, LOCAL_MAIN_DEF_MUTATION } from '../Utils/withApolloClient';

// TS Props
interface Props {
    data: any;
}

// Style-Component setup
const OwnHeroWrapper = styled.div`
    /* Sizing */
    width: 100vw;
    height: 98vh;
    /* Flexbox stuff */
    display: flex;
    justify-content: center;
    align-items: center;
    /* Text styles */
    text-align: center;
    /* Background styles */
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.63), rgba(72, 47, 62, 0.42)), url(${props => props.img || ''});
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
`;

// <MovieCarousel /> Functional Component
const MovieHero: React.FC<Props> = ({ data }: Props): React.ReactElement => {
    // Apollo Client - Query
    const { data: localDefData } = useQuery(LOCAL_MAIN_DEF_QUERY, { fetchPolicy: 'cache-only' });
    // Apollo Client - Mutation
    const [setDef] = useMutation(LOCAL_MAIN_DEF_MUTATION);

    // Detect if custom-size is true
    const isMobTab = useMediaQuery({ minWidth: 0, maxWidth: 1024 });

    // Component Setting
    const baseURL = 'https://image.tmdb.org/t/p/original/';

    // The movie image url
    const { backdrop_path, original_title, overview, id } = data !== undefined ? data : '';

    // Handler for click
    const handleBtnClick = e => {
        e.preventDefault();

        // Set Apollo local defs
        setDef({
            variables: {
                obj: {
                    modalOn: true,
                    clickStat: id,
                    identifierWrapper: 'preview',
                    trailerType: 'movie',
                },
            },
        }).then();
    };

    // Hero Design for the featured movie
    return (
        <>
            <Fade delay={50}>
                <OwnHeroWrapper img={baseURL + backdrop_path}>
                    <div className={`heroMovDetails ${!isMobTab && 'notMobTab'}`}>
                        <p
                            className="movHeroTitle has-text-centered-mobile
                        has-text-left-tablet is-size-1-tablet is-size-3-mobile"
                        >
                            {original_title}
                        </p>
                        <p
                            className="movHeroSyn has-text-centered-mobile has-text-left-tablet
                    is-size-8-mobile is-size-6-tablet is-size-6-desktop"
                        >
                            {overview === ''
                                ? `The movie "${original_title}" has no available synopsis yet.
                            It may be due to a server issue. Please bear with us and wait for a while.`
                                : overview !== undefined && overview.length > 400
                                ? `${overview.substring(0, 400)} ...`
                                : overview}
                        </p>
                        <br />
                        <button
                            onClick={handleBtnClick}
                            className={`button is-white is-outlined
                        ${!isMobTab && 'notMobTab'}
                        ${data === undefined && 'is-loading'}`}
                        >
                            <span>Trailer</span>
                            <span className="icon is-small">
                                <IoLogoYoutube size={16} />
                            </span>
                        </button>
                    </div>
                </OwnHeroWrapper>
            </Fade>

            {localDefData.modalOn && <MoviePreview />}
        </>
    );
};

export default MovieHero;
