import React, { lazy, Suspense } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

// Local Modules
import Spinner from './Spinner';
import { LOCAL_MAIN_DEF_MUTATION, LOCAL_MAIN_DEF_QUERY } from '../Utils/withApolloClient';
// Lazy
const MovieSynopsis = lazy(() => import('./MovieSynopsis'));

interface Props {
    active?: boolean;
    clipped?: boolean;
}

const MoviePreview: React.FC<Props> = ({ active, clipped }: Props): React.ReactElement => {
    // Apollo Client - Mutation
    const [setDef] = useMutation(LOCAL_MAIN_DEF_MUTATION);
    // Apollo Client - Query, querying default states
    const { data: localDefData } = useQuery(LOCAL_MAIN_DEF_QUERY, { fetchPolicy: 'cache-only' });

    // Handler for close
    const handleClose = e => {
        e.preventDefault();

        setDef({
            variables: {
                obj: {
                    modalOn: false,
                    clickStat: '',
                    identifierWrapper: '',
                    trailerType: '',
                },
            },
        }).then();
    };

    return (
        <div className={`container ${localDefData.modalOn && 'is-clipped'}`}>
            <div className={`modal ${localDefData.modalOn && 'is-active'}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title"></p>
                        <button onClick={handleClose} className="delete" aria-label="close"></button>
                    </header>
                    <section className="modal-card-body">
                        {localDefData.identifierWrapper === 'preview' && (
                            <Suspense fallback={<Spinner />}>
                                <MovieSynopsis />
                            </Suspense>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default MoviePreview;
