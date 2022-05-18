// Hook used to handle the user authen.
// handled in separate hook file instead of Home.js

import React from 'react';
// axios library used to make requests instead of something like fetch
import axios from 'axios';
import LogoutHook from './LogoutHook';

export default function useAuth(code) {
  const [accessToken, setAccessToken] = React.useState();
  const [refreshToken, setRefreshToken] = React.useState();
  const [expiresIn, setExpiresIn] = React.useState();

  React.useEffect(() => {
    // make a POST request using the URL and code info
    axios.post('http://localhost:3001/login', {
        code,
    }).then(res => {
        // then take the retrieved res and set the access, refresh, and expires tokens
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        // this line will hide the code in the URL
        window.history.pushState({}, null, '/');
    }).catch(() => {
        window.location = '/';
    })
  }, [code]);
  // whenever the code changes and the user needs to be authenticated again

// handle refreshing the access token once it expires
  React.useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
        axios.post('http://localhost:3001/refresh', {
            refreshToken,
        }).then(res => {
            setAccessToken(res.data.accessToken);
            setExpiresIn(res.data.expiresIn);
        }).catch(() => {
            window.location = '/';
        });
    }, (expiresIn - 60) * 1000)
    
    return () => clearInterval(interval);
    }, [refreshToken, expiresIn]);
    // This will run whenever the refresh or expires tokens change

  React.useEffect(() => {
    if (LogoutHook !== true) return;
    setAccessToken("");
    setRefreshToken("");
    setExpiresIn("");  
  });
  // access token needed to make different Spotify requests
  return accessToken;
}
