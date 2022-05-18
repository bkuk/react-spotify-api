import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';


export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = React.useState(false);
  
  React.useEffect(() => setPlay(true), [trackUri]);
  
  if (!accessToken) return null;

  return (
    <SpotifyPlayer
      token={accessToken}
      play={play}
      callback={state => {
        if (!state.isPlaying) setPlay(false);
      }}
      uris={trackUri ? [trackUri] : []}
    />
  );
}
