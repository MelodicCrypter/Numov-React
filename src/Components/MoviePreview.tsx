import React, { useContext, useState, lazy, Suspense } from 'react';

// Local Modules
import AppContext from './AppContext';
import Spinner from './Spinner';
// Lazy
const MovieSynopsis = lazy(() => import('./MovieSynopsis'));

interface Props {
    active: boolean;
    clipped?: boolean;
}

const MoviePreview: React.FC<Props> = ({ active, clipped }: Props): React.ReactElement => {
    // Context
    const [dataStore, setDataStore] = useContext<any>(AppContext);

    // States
    const [isActive, setIsActive] = useState<boolean | undefined>(active);
    const [isClipped, setIsClipped] = useState<boolean | undefined>(clipped);

    // Handler for close
    const handleClose = e => {
        e.preventDefault();

        setIsActive(false);
        setIsClipped(false);
        setDataStore({
            ...dataStore,
            modalOn: false,
            clickStat: '',
            identifierWrapper: '',
            trailerType: '',
        });
    };

    return (
        <div className={`modal ${isActive && 'is-active'} ${isClipped && 'is-clipped'}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title"></p>
                    <button onClick={handleClose} className="delete" aria-label="close"></button>
                </header>
                <section className="modal-card-body">
                    {dataStore.identifierWrapper === 'preview' && (
                        <Suspense fallback={<Spinner />}>
                            <MovieSynopsis />
                        </Suspense>
                    )}
                </section>
                <footer className="modal-card-foot"></footer>
            </div>
        </div>
    );
};

export default MoviePreview;
