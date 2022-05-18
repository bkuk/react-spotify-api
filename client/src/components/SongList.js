import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const songlistStyles = ({hover}) => ({
    cursor: 'default',
    background: hover ? '#535353' : '#191414'
});

const clickStyle = ({clickCheck}) => ({
    background: clickCheck ? '#b3b3b3' : '#535353'
});

export default function SongList(props) {
    const [hover, setHover] = React.useState(false);
    const [clickCheck, setClickCheck] = React.useState(false)

    return (
        <Row
            onClick={props.click}
            className="my-auto p-2 border-bottom"
            style={hover ? clickStyle({clickCheck}) : songlistStyles({hover})}
            onPointerOver={ () => setHover(true) }
            onPointerOut={ () => setHover(false) }
            onPointerDown={ () => setClickCheck(true) }
            onPointerUp={ () => setClickCheck(false) }
        >
            <Col>{props.songs.songName}</Col>
            <Col>{props.songs.songArtist}</Col>
            <Col>{props.songs.songAlbum}</Col>
        </Row>
    );
}