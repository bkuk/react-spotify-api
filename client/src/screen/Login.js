import React from "react";
import Stack from 'react-bootstrap/Stack'

// Account authorization URL created from query parameters required for authorization.
// Using Authorization Code Flow: client_id, response_type, redirect_uri, state, scope
const AUTH_URL = 
"https://accounts.spotify.com/authorize?client_id=817332553852442aaf3a58ab66f94b9c&response_type=code&redirect_uri=http://localhost:3000&scope=user-read-email%20user-read-private%20playlist-read-collaborative%20playlist-read-private%20streaming%20user-read-playback-state%20user-modify-playback-state";

export default function Login() {
    return (
        // <Stack className="text-center mt-auto text-light">
        <Stack className=" text-light d-flex flex-column min-vh-100 justify-content-center align-items-center">
            <h2>Convert your Spotify playlist to a downloadable QR code!</h2>
            <h3>Login with your Spotify account and choose your playlist.</h3>
            <div>
                <a className="btn btn-success btn-lg btn-block mt-5" href={AUTH_URL}>Login to Spotify</a>
            </div>
        </Stack>
    )
}