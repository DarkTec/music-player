import React, { useState, useEffect } from 'react';
import './App.css';
import NodeID3 from "node-id3";

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

    useEffect(() => {
        const loc = "C:\\Users\\mantl\\Music\\MusicBee\\Music\\Take That";
        (async () => {
            for await (const f of getFiles(loc)) {
                const tags: any = NodeID3.read(f);
                if (tags) {
                    tags.location = f;
                    setFiles(files => [...files, tags]);
                }
            }
        })()

    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Album</th>
                            <th>Artist</th>
                            <th>Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((value, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                    </td>
                                    <td>{value.album}</td>
                                    <td>{value.artist}</td>
                                    <td>{value.title}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </header>
        </div>
    );
}

export default App;