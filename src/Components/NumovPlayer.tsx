import React from 'react';
import YouTubePlayer from 'react-player/lib/players/YouTube';

// TS Props
interface Props {
    url: string;
}

const NumovPlayer: React.FC<Props> = ({ url }: Props): React.ReactElement => {
    return <YouTubePlayer url={url} width="100%" height="58vh" volume={1} />;
};

export default NumovPlayer;
