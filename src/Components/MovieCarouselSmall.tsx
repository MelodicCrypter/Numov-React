import React from 'react';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import Img from 'react-cool-img';

// Local Modules
import Eventor from './Eventor';
import Spinner from './Spinner';

// TS Props
interface Props {
    data: any;
    type: string;
    trailerType: string;
}

// <MovieCarousel /> Functional Component
const MovieCarouselSmall: React.FC<Props> = ({ data, type, trailerType }: Props): React.ReactElement => {
    // Component Setting
    const baseURL = 'https://image.tmdb.org/t/p/original/';

    // Determine if view is big or small
    return (
        <section className="section carousel">
            <div className="container is-fullhd">
                <div id={type} className="view-box">
                    {data !== undefined ? (
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
                                        <Img
                                            data-mov-id={d.id}
                                            data-trailer-type={trailerType}
                                            placeholder="/img/numov-img-loader.gif"
                                            error="/img/numov-img-error.jpg"
                                            src={baseURL + d.poster_path}
                                            alt={`Numov: ${d.original_title}`}
                                        />
                                    </Eventor>
                                );
                            })}
                        </Carousel>
                    ) : (
                        <Spinner />
                    )}
                </div>
            </div>
        </section>
    );
};

export default MovieCarouselSmall;
