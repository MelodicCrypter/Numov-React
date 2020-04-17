import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

// Local Modules
import Main from './Components/Main';
// Apollo client
import client from './Utils/withApolloClient';

// <App /> Component
const App = () => {
    return (
        <ApolloProvider client={client}>
            <Main />
        </ApolloProvider>
    );
};

export default App;
