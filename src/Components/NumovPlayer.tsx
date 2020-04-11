import React, { useContext } from 'react';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import Fade from 'react-reveal/Fade';

// Local Modules
import AppContext from './AppContext';

// TS Props
interface Props {
    url: string;
}

const NumovPlayer: React.FC<Props> = ({ url }: Props): React.ReactElement => {
    // Context
    const [dataStore] = useContext<any>(AppContext);

    return !url.includes('undefined') ? (
        <Fade>
            <div id="playerWrap" className="container">
                <YouTubePlayer
                    className="react-player"
                    url={url}
                    width="100%"
                    height="100%"
                    controls
                    // height={`${dataStore.identifierWrapper === 'preview' ? '70vh' : '58vh'}`}
                    volume={1}
                />
            </div>
        </Fade>
    ) : (
        <Fade delay={80}>
            <div className="container">
                <p className="has-text-centered has-text-grey has-text-facebook is-size-5-tablet is-size-6-mobile">
                    Sorry, but as of the moment there is no available trailer. <span role="img">😢</span>
                </p>
            </div>
        </Fade>
    );
};

export default NumovPlayer;
