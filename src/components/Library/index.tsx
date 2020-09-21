import Fuse from "fuse.js";
import { sortBy } from "lodash";
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import { Container, Icon, Input, Menu, Table } from "semantic-ui-react";
import './index.css';
import { changeSong } from "redux/actions";
import { useDispatch, useSelector } from "react-redux";

function Library() {

    // eslint-disable-next-line
    const [songsDB, setDB2] = useState(useIndexedDB('songs'));
    const [files, setFiles] = useState([]);
    const [column, setColumn] = useState(null);
    const [direction, setDirection] = useState(null);
    const [filterStr, setFilter] = useState('');
    const [fuse, setFuse]: any = useState();
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const dispatch = useDispatch();
    const playing: any = useSelector<any>(state => state.songs);

    useEffect(() => {
        (async () => {
            const songs = await songsDB.getAll();
            const options = { threshold: 0.1, keys: ['title', 'artist', 'album'] };
            const myIndex = Fuse.createIndex(options.keys, songs);

            setFiles(songs);
            setFuse(new Fuse(songs, options, myIndex));
        })();
    }, [songsDB]);

    const handleClick = (tags, index) => {
        if (playing?.tags.location === tags.location && playing?.playing) {
            dispatch(changeSong(tags, false));
        } else {
            dispatch(changeSong(tags, true));
        }
        forceUpdate();
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
        <Container fluid>
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
                        <Table.HeaderCell sorted={column === 'genre' ? direction : null} onClick={handleSort.bind(this, 'genre')}>Genre</Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'year' ? direction : null} onClick={handleSort.bind(this, 'year')}>Year</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {filterStr
                        ? fuse?.search(filterStr).map((value, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>
                                        {playing?.tags.location !== value.location
                                            ? <Icon name='play' onClick={handleClick.bind(this, value.item, index)} />
                                            : <Icon name='stop' onClick={handleClick.bind(this, value.item, index)} />
                                        }
                                    </Table.Cell>
                                    <Table.Cell>{value.item.album}</Table.Cell>
                                    <Table.Cell>{value.item.artist}</Table.Cell>
                                    <Table.Cell>{value.item.title}</Table.Cell>
                                    <Table.Cell>{value.item.genre}</Table.Cell>
                                    <Table.Cell>{value.item.year}</Table.Cell>
                                </Table.Row>
                            )
                        })
                        : files.map((value, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>
                                        {playing && playing.playing && playing.tags.location === value.location
                                            ? <Icon name='stop' onClick={handleClick.bind(this, value, index)} />
                                            : <Icon name='play' onClick={handleClick.bind(this, value, index)} />
                                        }
                                    </Table.Cell>
                                    <Table.Cell>{value.album}</Table.Cell>
                                    <Table.Cell>{value.artist}</Table.Cell>
                                    <Table.Cell>{value.title}</Table.Cell>
                                    <Table.Cell>{value.genre}</Table.Cell>
                                    <Table.Cell>{value.year}</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
        </Container>
    );
}

export default Library;