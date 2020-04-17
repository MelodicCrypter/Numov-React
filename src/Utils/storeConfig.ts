import localforage from 'localforage';

const lfConfig = () => {
    localforage.config({
        driver: localforage.INDEXEDDB,
        name: 'Numov',
        version: 2,
        storeName: 'NumovStore',
        description: 'Local storage for Numov using localforage',
    });
};
export default lfConfig;
