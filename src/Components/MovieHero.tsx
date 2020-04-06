import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IoLogoYoutube } from 'react-icons/io';

// Local Modules
import MoviePreview from './MoviePreview';
import AppContext from './AppContext';

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
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(72, 47, 62, 0.3)), url(${props => props.img || ''});
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
`;

// <MovieCarousel /> Functional Component
const MovieHero: React.FC<Props> = ({ data }: Props): React.ReactElement => {
    // Component Setting
    const baseURL = 'https://image.tmdb.org/t/p/original/';
    // The movie image url
    const { backdrop_path, original_title, overview, id } = data !== undefined ? data : '';

    // Context
    const [dataStore, setDataStore] = useContext<any>(AppContext);

    // States
    const [isClicked, setIsClicked] = useState<boolean>(false);

    useEffect(() => {
        if (!dataStore.modalOn) {
            setIsClicked(false);
        } else {
            setIsClicked(true);
        }
    }, [dataStore.modalOn]);

    // Handler for click
    const handleBtnClick = e => {
        e.preventDefault();

        // Set context
        setDataStore({
            ...dataStore,
            modalOn: true,
            clickStat: id,
            identifierWrapper: 'preview',
            trailerType: 'movie',
        });
    };

    // Hero Design for the featured movie
    return (
        <>
            <OwnHeroWrapper img={baseURL + backdrop_path}>
                <div className="heroMovDetails has-text-left">
                    <p className="movHeroTitle is-5-mobile">{original_title}</p>
                    <p className="movHeroSyn is-6-mobile">
                        {overview === ''
                            ? `The movie "${original_title}" has no available synopsis yet.
                            It may be due to a server issue. Please bear with us and wait for a while.`
                            : overview}
                    </p>
                    <br />
                    <button onClick={handleBtnClick} className="button is-white is-outlined">
                        <span>Trailer</span>
                        <span className="icon is-small">
                            <IoLogoYoutube size={16} />
                        </span>
                    </button>
                </div>
            </OwnHeroWrapper>

            {isClicked && <MoviePreview active clipped />}
        </>
    );
};

export default MovieHero;
