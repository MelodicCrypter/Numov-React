import React, { useContext } from 'react';
import YouTubePlayer from 'react-player/lib/players/YouTube';

// Local Modules
import AppContext from './AppContext';

// TS Props
interface Props {
    url: string;
}

const NumovPlayer: React.FC<Props> = ({ url }: Props): React.ReactElement => {
    // Context
    const [dataStore] = useContext<any>(AppContext);

    return (
        <YouTubePlayer
            url={url}
            width="100%"
            height={`${dataStore.identifierWrapper === 'preview' ? '70vh' : '58vh'}`}
            volume={1}
        />
    );
};

export default NumovPlayer;
