import React from 'react';
import Fade from 'react-reveal/Fade';

// TS Props
interface Props {
    trailID: string;
}

const NumovPlayer: React.FC<Props> = ({ trailID }: Props): React.ReactElement => {
    // Youtube url
    const yt = `https://www.youtube.com/embed/${trailID}?html5=1&amp;rel=0&amp;hl=en_US&amp;version=3`;

    return trailID !== undefined ? (
        <Fade>
            <div id="playerWrap" className="container">
                {/*<YouTubePlayer*/}
                {/*    className="react-player"*/}
                {/*    url={url}*/}
                {/*    width="100%"*/}
                {/*    height="100%"*/}
                {/*    controls*/}
                {/*    // height={`${dataStore.identifierWrapper === 'preview' ? '70vh' : '58vh'}`}*/}
                {/*    volume={1}*/}
                {/*/>*/}

                <div className="playerBody">
                    <object width="100%" height="100%">
                        {/*<param*/}
                        {/*    name="movie"*/}
                        {/*    value={yt}*/}
                        {/*/>*/}
                        {/*<param name="allowFullScreen" value="true" />*/}
                        {/*<param name="allowscriptaccess" value="always" />*/}
                        <embed
                            width="100%"
                            height="100%"
                            src={yt}
                            className="youtube-player"
                            type="text/html"
                            // @ts-ignore
                            allowscriptaccess="always"
                            allowFullScreen
                        />
                    </object>
                </div>
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
