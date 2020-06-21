import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { initDB } from 'react-indexed-db';
import { useHistory, BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import { Container, Icon, Menu } from 'semantic-ui-react';
import { DBConfig } from './DBConfig';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Library from "./components/Library";
import Dashboard from 'components/Dashboard';
import Settings from 'components/Settings';

initDB(DBConfig);

//@ts-ignore
var win = nw.Window.get();
win.maximize();

function TabMenu() {
    const history = useHistory();
    const [route, setRoute] = useState("/home")

    const handleClick = (url) => {
        history.push(url);
        setRoute(url);
    }

    return (
        <Menu fixed='bottom' inverted fluid widths={4} icon='labeled'>
            <Container fluid>
                <Menu.Item name="home" active={route === "/home"} onClick={handleClick.bind(this, "/home")}>
                    <Icon name='home' size='big' />  Home
                    </Menu.Item>
                <Menu.Item active={route === "/library"} onClick={handleClick.bind(this, "/library")}>
                    <Icon name='music' size='big' /> Library
                    </Menu.Item>
                <Menu.Item>
                    <Icon name='radio' size='big' /> Stations
                    </Menu.Item>
                <Menu.Item active={route === "/settings"} onClick={handleClick.bind(this, "/settings")}>
                    <Icon name='settings' size='big' /> Settings
                    </Menu.Item>
            </Container>
        </Menu>
    )
}

ReactDOM.render(
    <Router>
        <Container inverted="true" fluid style={{ marginTop: '2.85714286em' }}>
            <TabMenu />
            <Switch>
                <Route path="/settings">
                    <Settings />
                </Route>
                <Route path="/library">
                    <Library />
                </Route>
                <Route path="/">
                    <Dashboard />
                </Route>
            </Switch>
        </Container>
    </Router>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
