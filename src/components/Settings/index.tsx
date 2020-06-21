import NodeID3 from "node-id3";
import React, { useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import { Button, Container, Input, Segment } from "semantic-ui-react";

const { resolve } = require('path');
const { readdir } = require('fs').promises;

async function* getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res);
        } else {
            yield res;
        }
    }
}

function Settings() {

    const [songsDB, setDB] = useState(useIndexedDB('songs'));
    const [settingsDB, setDB1] = useState(useIndexedDB('settings'));
    const [directory, setDirectory] = useState('');

    const addFolder = async () => {
        await settingsDB.add({directory})
        for await (const f of getFiles(directory)) {
            const tags: any = NodeID3.read(f);
            if (tags) {
                tags.location = f;
                try {
                    await songsDB.add(tags);
                } catch (e) {}
            }
        }
    };

    return (
        <Container>
            <h2 style={{color: 'white'}}>Music Directory</h2>
            <Input icon="folder" iconPosition="left" fluid onChange={(e) => setDirectory(e.target.value)} />
            <br />
            <Button color="violet" onClick={addFolder}>Add folder</Button>
            <br /><br /><br /><br />
            <Segment inverted color="blue" textAlign="center">
                <p style={{fontSize: "16px"}}>Note: Adding a folder above will add any non-duplicate files to the library tab</p>
            </Segment>
        </Container>
    );
}

export default Settings;