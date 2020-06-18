import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import {
    Container,
    Dropdown,
    Menu,
} from 'semantic-ui-react';

ReactDOM.render(
    <React.StrictMode>
        <Menu fixed='top' inverted>
            <Container fluid>
                <Dropdown item simple text='File'>
                    <Dropdown.Menu>
                        <Dropdown.Item>Quit</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Menu>
        <Container inverted="true" fluid style={{ marginTop: '2.85714286em' }}>
            <App />
        </Container>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
