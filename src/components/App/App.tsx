import React, { useState, useEffect } from 'react';
import './App.css';
import NodeID3 from "node-id3";
import { Table, Icon, Menu, Container, Input } from "semantic-ui-react";
import { sortBy, filter } from "lodash";
import LoadingOverlay from 'react-loading-overlay';

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

function App() {

    const [files, setFiles] = useState([]);
    const [playing, setPlaying] = useState();
    const [audio, setAudio] = useState(new Audio());
    const [column, setColumn] = useState(null);
    const [direction, setDirection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterStr, setFilter] = useState('');


    useEffect(() => {
        setAudio(new Audio());

        const loc = prompt("Enter the folder path");
        //const loc = "C:\\Users\\mantl\\Music\\MusicBee\\Music\\Take That";
        (async () => {
            const res = [];
            for await (const f of getFiles(loc)) {
                const tags: any = NodeID3.read(f);
                if (tags) {
                    tags.location = f;
                    res.push(tags);
                }
            }
            setFiles(res);
            setLoading(false);
        })()
    }, []);

    const handleClick = (tags, index) => {
        let audioSplit = audio.src.split("/");
        let audioName = decodeURIComponent(audioSplit[audioSplit.length - 1]);

        let tagSplit = tags.location.split("\\");
        let tagName = tagSplit[tagSplit.length - 1];

        if (audioName !== tagName) {
            audio.src = tags.location;
            audio.play();
            setPlaying(index);
        }

        if (audioName === tagName) {
            audio.pause();
            audio.src = '';
            setPlaying(null);
        }
    }

    const handleSort = (clickedColumn) => {
        if (column !== clickedColumn) {
            setColumn(clickedColumn);
            setDirection('ascending');
            setFiles(sortBy(files, [clickedColumn]));

            return;
        }

        setColumn(clickedColumn);
        setFiles(files.reverse());
        setDirection(direction === 'ascending' ? 'descending' : 'ascending');

    };

    return (
        <LoadingOverlay
            active={loading}
            spinner
            text='Indexing...'
        >

            <Menu fixed='top' inverted>
                <Container fluid>
                    <Menu.Item>
                        <Input transparent inverted placeholder='Filter...' onChange={(e) => setFilter(e.target.value)} />
                    </Menu.Item>
                </Container>
            </Menu>
            <Table sortable celled inverted>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'album' ? direction : null} onClick={handleSort.bind(this, 'album')}>Album</Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'artist' ? direction : null} onClick={handleSort.bind(this, 'artist')}>Artist</Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'title' ? direction : null} onClick={handleSort.bind(this, 'title')}>Title</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {filter(files, (file) =>
                        file.album.toLowerCase().includes(filterStr.toLowerCase()) ||
                        file.title.toLowerCase().includes(filterStr.toLowerCase()) ||
                        file.artist.toLowerCase().includes(filterStr.toLowerCase()))
                        .map((value, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>
                                        {playing !== index
                                            ? <Icon name='play' onClick={handleClick.bind(this, value, index)} />
                                            : <Icon name='stop' onClick={handleClick.bind(this, value, index)} />
                                        }
                                    </Table.Cell>
                                    <Table.Cell>{value.album}</Table.Cell>
                                    <Table.Cell>{value.artist}</Table.Cell>
                                    <Table.Cell>{value.title}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                </Table.Body>
            </Table>
        </LoadingOverlay>
    );
}

export default App;