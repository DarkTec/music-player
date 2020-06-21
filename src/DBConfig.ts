export const DBConfig = {
    name: 'MyDB',
    version: 1,
    objectStoresMeta: [
        {
            store: 'settings',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'directory', keypath: 'directory', options: { unique: false } },
            ]
        },
        {
            store: 'songs',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'title', keypath: 'title', options: { unique: false } },
                { name: 'album', keypath: 'directory', options: { unique: false } },
                { name: 'artist', keypath: 'directory', options: { unique: false } },
                { name: 'genre', keypath: 'directory', options: { unique: false } },
                { name: 'trackNumber', keypath: 'directory', options: { unique: false } },
                { name: 'size', keypath: 'directory', options: { unique: false } },
                { name: 'year', keypath: 'directory', options: { unique: false } },
                { name: 'location', keypath: 'location', options: { unique: true } }
            ]
        }
    ]
};