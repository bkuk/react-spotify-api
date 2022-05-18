import React from "react";

const playlistStyles = ({hover}) => ({
    cursor: 'default',
    background: hover ? '#535353' : '#191414' 
});

const clickStyle = ({clickCheck}) => ({
    background: clickCheck ? '#b3b3b3' : '#535353'
});

export default function Playlists(props) {
    const [hover, setHover] = React.useState(false);
    const [clickCheck, setClickCheck] = React.useState(false)

    return (
        <div
            onClick={props.click}
            className="border-bottom p-2 my-auto"
            style={hover ? clickStyle({clickCheck}) : playlistStyles({hover}) }
            onPointerOver={ () => setHover(true) }
            onPointerOut={ () => setHover(false) }
            onPointerDown={ () => setClickCheck(true) }
            onPointerUp={ () => setClickCheck(false) }
        >
            {props.playlist}
        </div>
    );
}