import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import { Container } from 'semantic-ui-react';

ReactDOM.render(
    <Container inverted="true" fluid style={{ marginTop: '2.85714286em' }}>
        <App />
    </Container>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
