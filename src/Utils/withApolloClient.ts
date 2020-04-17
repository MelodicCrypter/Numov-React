import ApolloClient, { InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';

// Apollo: GQLS
const LOCAL_MAIN_DEF_QUERY = gql`
    query @client {
        clickStat
        identifierWrapper
        trailerType
        modalOn
    }
`;
const LOCAL_MOVIE_QUERY = gql`
    query @client {
        heroMovData {
            backdrop_path
            original_title
            overview
            id
        }
        upcomingMovData {
            original_title
            poster_path
            id
        }
        topTVData {
            original_name
            poster_path
            id
        }
        topMovData {
            original_title
            poster_path
            id
        }
        topRatedAllTimeData {
            original_title
            poster_path
            id
        }
        actionData {
            original_title
            poster_path
            id
        }
        docData {
            original_title
            poster_path
            id
        }
        advenData {
            original_title
            poster_path
            id
        }
        comData {
            original_title
            poster_path
            id
        }
        famData {
            original_title
            poster_path
            id
        }
        animeData {
            original_title
            poster_path
            id
        }
        thrillData {
            original_title
            poster_path
            id
        }
        romData {
            original_title
            poster_path
            id
        }
        dramaData {
            original_title
            poster_path
            id
        }
        musicData {
            original_title
            poster_path
            id
        }
        crimeData {
            original_title
            poster_path
            id
        }
        histoData {
            original_title
            poster_path
            id
        }
        mysData {
            original_title
            poster_path
            id
        }
        horData {
            original_title
            poster_path
            id
        }
    }
`;
const LOCAL_MAIN_DEF_MUTATION = gql`
    mutation LOCAL_DEF_MUTATION($obj: [String]) {
        setDef(obj: $obj) @client
    }
`;
const LOCAL_MOVIE_MUTATION = gql`
    mutation LOCAL_MOVIE_MUTATION($type: String!, $movArray: [String]) {
        saveData(type: $type, movArray: $movArray) @client
    }
`;

// Query and Mutation
const resolvers = {
    Mutation: {
        setDef: (_root, args, { cache }) => {
            // Get the new values
            const {
                obj: { modalOn, clickStat, identifierWrapper, trailerType },
            } = args;

            // Get the current state
            const existingData = cache.readQuery({
                query: LOCAL_MAIN_DEF_QUERY,
            });

            // Prepare data
            const newData = {
                data: {
                    ...existingData,
                    modalOn,
                    clickStat,
                    identifierWrapper,
                    trailerType,
                },
            };

            // Save new data
            cache.writeData(newData);
            return newData;
        },
        saveData: (_root, args, { cache }) => {
            // type is just a identifier
            // movArray is the movie array of objects
            const { type, movArray } = args;
            let newMovArray;

            // Add __typename key, Apollo Client is strict
            if (type !== 'heroMovData') {
                newMovArray = movArray.map(v => ({ ...v, __typename: 'Movie' }));
            } else if (type === 'heroMovData') {
                newMovArray = { ...movArray, __typename: 'Movie' };
            }

            // Prepare data
            const data = {
                data: { [args.type]: newMovArray },
            };

            // Save new data
            cache.writeData(data);
            return data;
        },
    },
};

// TypeDefs
const typeDefs = gql`
    type Movie {
        original_title: String
    }
`;

// Defaul Local States
const defaults = {
    __typename: 'Defaults',
    clickStat: '',
    identifierWrapper: '',
    trailerType: '',
    modalOn: false,
    heroMovData: [],
    upcomingMovData: [],
    topTVData: [],
    topMovData: [],
    topRatedAllTimeData: [],
    actionData: [],
    docData: [],
    advenData: [],
    comData: [],
    famData: [],
    animeData: [],
    thrillData: [],
    romData: [],
    dramaData: [],
    musicData: [],
    crimeData: [],
    histoData: [],
    mysData: [],
    horData: [],
};

// The Apollo client
const client = new ApolloClient({
    cache: new InMemoryCache(),
    clientState: {
        resolvers,
        defaults,
        typeDefs,
    },
});

export { LOCAL_MAIN_DEF_QUERY, LOCAL_MAIN_DEF_MUTATION, LOCAL_MOVIE_MUTATION, LOCAL_MOVIE_QUERY };
export default client;
