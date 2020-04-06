import { createContext } from 'react';

// Creating the context, no Interface used yet
// const { Provider: AppContextProvider, Consumer: AppContextConsumer } = createContext<any>(null!);
const AppContext = createContext<unknown>(null!);

export default AppContext;
