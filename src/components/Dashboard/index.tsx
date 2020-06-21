import React from 'react';
import { Container, Segment } from "semantic-ui-react";

function Dashboard() {

    return (
        <Container>
            <Segment inverted color="violet" padded='very' textAlign="center">
                <h1>DarkTec Music Player</h1>
            </Segment>
        </Container>
    );
}

export default Dashboard;