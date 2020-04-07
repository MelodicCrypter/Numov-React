import React from 'react';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

// Local Modules
import Eventor from './Eventor';
import Spinner from './Spinner';

// TS Props
interface Props {
    data: any;
    view: string;
    type: string;
    trailerType: string;
}

// <MovieCarousel /> Functional Component
const MovieCarousel: React.FC<Props> = ({ data, view, type, trailerType }: Props): React.ReactElement => {
    // Component Setting
    const baseURL = 'https://image.tmdb.org/t/p/original/';

    // Determine if view is big or small
    return (
        <section className="section carousel">
            <div className="container is-fullhd">
                <div id={type} className="view-box">
                    {view === 'big' &&
                        (data !== undefined ? (
                            <Carousel
                                arrows
                                infinite
                                slidesPerPage={5}
                                slidesPerScroll={4}
                                breakpoints={{
                                    1000: {
                                        slidesPerPage: 3,
                                        slidesPerScroll: 3,
                                        clickToChange: false,
                                        centered: false,
                                        arrows: true,
                                    },
                                    500: {
                                        slidesPerPage: 1,
                                        slidesPerScroll: 1,
                                        clickToChange: false,
                                        centered: false,
                                    },
                                }}
                            >
                                {data.map(d => {
                                    return (
                                        <Eventor key={d.id}>
                                            <img
                                                data-mov-id={d.id}
                                                data-trailer-type={trailerType}
                                                src={baseURL + d.poster_path}
                                                alt={`Numov: ${d.original_title}`}
                                            />
                                        </Eventor>
                                    );
                                })}
                            </Carousel>
                        ) : (
                            <Spinner />
                        ))}

                    {view === 'small' &&
                        (data !== undefined ? (
                            <Carousel
                                arrows
                                infinite
                                slidesPerPage={10}
                                slidesPerScroll={9}
                                breakpoints={{
                                    1000: {
                                        slidesPerPage: 5,
                                        slidesPerScroll: 4,
                                        clickToChange: false,
                                        centered: false,
                                        arrows: true,
                                    },
                                    500: {
                                        slidesPerPage: 2,
                                        slidesPerScroll: 2,
                                        clickToChange: false,
                                        centered: false,
                                    },
                                }}
                            >
                                {data.map(d => {
                                    return (
                                        <Eventor key={d.id}>
                                            <img
                                                data-mov-id={d.id}
                                                data-trailer-type={trailerType}
                                                src={baseURL + d.poster_path}
                                                alt={`Numov: ${d.original_title}`}
                                            />
                                        </Eventor>
                                    );
                                })}
                            </Carousel>
                        ) : (
                            <Spinner />
                        ))}
                </div>
            </div>
        </section>
    );
};

export default MovieCarousel;
