// used to authenticate user using nodejs/express framework, spotify-web-api-node
// cors/bodyParser libraries middleware libraries
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// POST request used for refreshing the access token
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    // set credentials for refresh token
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken,
    });
    // refreseh the access token and create a new one if time expires
    spotifyApi.refreshAccessToken().then((data) => {
        res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn
        });
    }).catch(() => {
        res.sendStatus(400);
    });
});

// POST request to authenticate the login
app.post('/login', (req, res) => {
    const code = req.body.code;
    // spotifyApi will set the credentials needed to retrieve the access/refresh tokens
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    });

    // authorize the credentials that were set in spotifyApi
    spotifyApi.authorizationCodeGrant(code).then(data => {
        // Then retrieve the access, refresh tokens in json format
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        });
    }).catch(() => {
        res.sendStatus(400);
    });
});

app.listen(3001);