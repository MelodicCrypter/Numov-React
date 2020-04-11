import genres from '../Model/data';

/**
 *
 * @param genre
 *
 * This will return the genre's id
 */
const getGenreId = (genre: string) => {
    const movie: Array<any> = genres.filter(g => g.name === genre);
    const { id }: { id: number } = movie[0];

    return id;
};

export default getGenreId;
