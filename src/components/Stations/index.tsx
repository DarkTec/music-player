import React from 'react';
import { Container, Button, Card, Image } from "semantic-ui-react";
import { useDispatch } from 'react-redux';
import { changeSong } from 'redux/actions';
import Parser from "icecast-parser";

function Stations() {

    const dispatch = useDispatch();

    const openUrl = () => {
        require('nw.gui').Shell.openExternal("https://xradio.zone");
    }

    const playStream = (url) => {
        const radioStation = new Parser(url);

        radioStation.on('metadata', function (metadata) {
            console.log([metadata.StreamTitle, 'is playing on', url]);
        });
        // dispatch(changeSong({location: url, artist: "Xradio"}, true))
    }

    return (
        <Container>
            <Card.Group>
                <Card>
                    <Card.Content>
                        <Card.Header>XRadio</Card.Header>
                        <Card.Meta><a onClick={openUrl.bind(this)}>https://xradio.zone</a></Card.Meta>
                    </Card.Content>
                    <Card.Content extra>
                        <Button color='green' onClick={playStream.bind(this, 'http://xradio.zone:9420/index.mp3')}>Play</Button>
                    </Card.Content>
                </Card>
            </Card.Group>
        </Container>
    );
}

export default Stations;