import NodeID3 from "node-id3";
import React, { useState, useEffect } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import { Button, Container, Input, Segment, Table, Icon } from "semantic-ui-react";

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
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        updateFolders();
        deleteFolder("C:\\Users\\mantl\\Music\\MusicBee\\Music\\Take That");
    }, [])

    const deleteFolder = async (folder) => {
        songsDB.openCursor((event: any) => {
            let cursor = event.target.result;
            if (cursor) {
                if (cursor.value.location.includes(folder)) {
                    songsDB.deleteRecord(cursor.value.id)
                }
                cursor.continue();
            }
        }, null);

        const res = await settingsDB.getByIndex("directory", folder);
        if (res) settingsDB.deleteRecord(res.id);

        updateFolders();
    }

    const updateFolders = async () => {
        const folders = await settingsDB.getAll();
        const res = []
        for (let folder of folders) {
            res.push(folder.directory);
        }
        setFolders(res);
    }

    const addFolder = async () => {
        await settingsDB.add({ directory })
        for await (const f of getFiles(directory)) {
            const tags: any = NodeID3.read(f);
            if (tags) {
                tags.location = f;
                try {
                    await songsDB.add(tags);
                } catch (e) { }
            }
        }
    };

    return (
        <Container>
            <h2 style={{ color: 'white' }}>Music Directory</h2>
            <Input icon="folder" iconPosition="left" fluid onChange={(e) => setDirectory(e.target.value)} />
            <br />
            <Button color="violet" onClick={addFolder}>Add folder</Button>
            <br /><br />
            <Segment inverted color="blue" textAlign="center">
                <p style={{ fontSize: "16px" }}>Note: Adding a folder above will add any non-duplicate files to the library tab</p>
            </Segment>
            <br />
            <Table sortable inverted>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Directory</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        folders.map((value, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>{value}</Table.Cell>
                                    <Table.Cell width="1" textAlign="center"><Icon name="delete" onClick={deleteFolder.bind(this, value)} /></Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
        </Container>
    );
}

export default Settings;