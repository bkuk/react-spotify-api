import React from "react";
import {Container, Stack, Button, Row, Col} from "react-bootstrap";
import SpotifyWebApi from 'spotify-web-api-node';
import useAuth from '../hooks/useAuth';
import Playlists from '../components/Playlists';
import SongList from '../components/SongList';
import QRModal from '../components/QRModal';
import Logout from "../components/Logout";
import Player from "../components/Player";

const spotifyApi = new SpotifyWebApi({
    cliendId: "817332553852442aaf3a58ab66f94b9c",    
});

export default function Home({ code }) {
    const accessToken = useAuth(code);
    const [profile, setProfile] = React.useState({});
    const [playlists, setPlaylists] = React.useState([]);
    const [selectedPlaylistInfo, setSelectedPlaylistInfo] = React.useState("");
    const [songList, setSongList] = React.useState([]);
    const [songOffset, setSongOffset] = React.useState();
    const [playingTrack, setPlayingTrack] = React.useState();
    const [showQRModal, setShowQRModal] = React.useState(false);
    const songListStyle = {
        overflowY: 'scroll',
        overflowX: 'hidden',
        height: '950px'
    };
    const playlistListStyle = {
        overflowY: 'scroll',
        overflowX: 'hidden',
        height: '675px'
    };

    // authenticate user whenever accessToken is changed
    React.useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
        // retrieve the profile information
        spotifyApi.getMe().then(data => {
            setProfile(() => {
                return {
                    profileName: data.body.display_name,
                    profileImageUrl: data.body.images[0].url
                }
            });
        }, err => {
            console.log(err);
        })
        // retrieve all playlist that they follow/created
        spotifyApi.getUserPlaylists().then(data => {
            setPlaylists(data.body.items.map(playlistsInfo => {
                return {
                    playlistName: playlistsInfo.name,
                    playlistUrl: playlistsInfo.external_urls.spotify,
                    playlistId: playlistsInfo.id,
                    trackAmount: playlistsInfo.tracks.total
                }
            }));
        }, err => {
            console.log(err);
        })
    }, [accessToken]);

    // react to whenever the songOffset changes
    React.useEffect(() => {
        if (songOffset > Math.ceil(selectedPlaylistInfo.trackNum / 100) * 100) {
            setSongOffset(songOffset - 100)
        }
        if (songOffset >= 0 && songOffset < Math.ceil(selectedPlaylistInfo.trackNum / 100) * 100) {
            spotifyApi.getPlaylistTracks(selectedPlaylistInfo.playlistId, {offset: songOffset, limit: 100, field: 'items'}).then(data => {
                setSongList(data.body.items.map(playlistSongs => { 
                    return {
                        ...songList,
                        songName: playlistSongs.track.name,
                        songArtist: playlistSongs.track.artists[0].name,
                        songAlbum: playlistSongs.track.album.name,
                        songUri: playlistSongs.track.uri
                    } 
                }))
            }, err => {
                console.log(err);
            });
        }
    }, [songOffset])

    // called when playlist is clicked, retrieve the selected playlist first 100 songs
    function getPlaylistSongs(playlistPick, playlistName, playlistUrl, trackAmount) {
        // retrieve songlist if given a specified playlistID (retrieved from getUserPlaylist)
        spotifyApi.getPlaylistTracks(playlistPick, {limit: 100, field: 'items'}).then(data => {
            setSongList(data.body.items.map(playlistSongs => { 
                return {
                    songName: playlistSongs.track.name,
                    songArtist: playlistSongs.track.artists[0].name,
                    songAlbum: playlistSongs.track.album.name,
                    songUri: playlistSongs.track.uri
                } 
            }))
        }, err => {
            console.log(err);
        });
        setSelectedPlaylistInfo(() => {
            return {
                playlistId: playlistPick,
                displayName: playlistName,
                trackNum: trackAmount,
                convertUrl: playlistUrl
            }});
        // When a new playlist is selected, the offset will go back to 100
        setSongOffset(0);
    }

    function chooseTrack(songs) {
        setPlayingTrack(songs);
    }

    function openQRModal() {
        setShowQRModal(true);
    }

    return (
        <Container className="text-light my-5">
            <Row className="mb-2">
                <Col sm={4}>
                    <Stack>
                        <img
                            src={profile.profileImageUrl}
                            alt="Profile Pic"
                            style={{width:"300px", height:"300px"}}
                            className="w-50 h-50 rounded-circle mx-auto"
                        />
                        <h3 className="mt-2 text-center">{profile.profileName}</h3>
                    </Stack>
                    <hr />
                    <h5 className="pb-1">Playlists</h5>
                    <Stack className="border" style={playlistListStyle}>
                        {playlists.map((playlistResults, index) => (
                            <Playlists
                                click={() => getPlaylistSongs(playlistResults.playlistId, playlistResults.playlistName, playlistResults.playlistUrl, playlistResults.trackAmount)}
                                playlist={playlistResults.playlistName}
                                key={index}
                            />
                        ))}
                    </Stack>
                </Col>
                
                <Col sm={8}>
                    <Stack>
                        <Logout />
                        <Button
                            onClick={selectedPlaylistInfo.displayName && openQRModal}
                            open={showQRModal}
                            className="w-50 mx-auto"
                            variant="success">
                                GET <b>QR CODE</b> FOR SELECTED PLAYLIST
                        </Button>
                        <h4 className="mt-3 mx-2">{selectedPlaylistInfo.displayName}</h4>
                        <Stack className="p-2 border" style={songListStyle}>
                            <Row>
                                <Col><h5>Title</h5></Col>
                                <Col><h5>Artist</h5></Col>
                                <Col><h5>Album</h5></Col>
                            </Row>
                            {songList.map((songs, index) => (
                                <SongList
                                    click={() => chooseTrack(songs)}
                                    songs={songs}
                                    key={index}
                                />
                            ))}
                            <div className="mx-auto my-3">
                                <Button
                                    onClick={() => {songOffset > 0 ? setSongOffset(songOffset - 100) : setSongOffset(songOffset)}}
                                    className="me-3"
                                    variant="success"
                                >
                                    ←
                                </Button>
                                <Button
                                    onClick={() => {songOffset < (Math.ceil(selectedPlaylistInfo.trackNum / 100) * 100) - 100 ? setSongOffset(songOffset + 100) : setSongOffset(songOffset)}}
                                    className="ms-3"
                                    variant="success"
                                >
                                    →
                                </Button>
                            </div>
                        </Stack>
                    </Stack>
                </Col>
            </Row>
            <div className="mt-2">
                <Player accessToken={accessToken} trackUri={playingTrack ? playingTrack.songUri : null} />
            </div>
            {selectedPlaylistInfo.displayName && 
            <QRModal
                open={showQRModal}
                handleClose={() => setShowQRModal(false)}
                name={selectedPlaylistInfo.displayName}
                url={selectedPlaylistInfo.convertUrl}
            />}
        </Container>
    )
}