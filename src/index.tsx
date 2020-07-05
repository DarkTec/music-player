import React, { useState, useEffect, RefObject } from 'react';
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
import { createStore } from 'redux';
import reducer from "./redux/reducers";
import { Provider, useSelector, useDispatch } from 'react-redux';
import { changeSong } from "redux/actions";
import Stations from 'components/Stations';

const store = createStore(reducer);

initDB(DBConfig);

//@ts-ignore
var win = nw.Window.get();
win.maximize();

function TabMenu() {
    const history = useHistory();
    const [route, setRoute] = useState("/home");

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
                <Menu.Item active={route === "/stations"} onClick={handleClick.bind(this, "/stations")}>
                    <Icon name='radio' size='big' /> Stations
                    </Menu.Item>
                <Menu.Item active={route === "/settings"} onClick={handleClick.bind(this, "/settings")}>
                    <Icon name='settings' size='big' /> Settings
                    </Menu.Item>
            </Container>
        </Menu>
    )
}

function MainApp() {
    const [playing, setPlaying] = useState(false);
    const audio: RefObject<HTMLAudioElement> = React.createRef();
    const result: any = useSelector<any>(state => state.songs);

    const dispatch = useDispatch();

    useEffect(() => {
        if (result?.playing) {
            audio.current.src = result.tags.location;
            audio.current.play();
            setPlaying(true);
        } else {
            setPlaying(false);
            audio.current.pause();
            audio.current.src = '';
        }
    }, [result]);

    const handleClick = () => {
        dispatch(changeSong(audio.current.src, false));
    }

    return (
        <Router>
            <Container inverted="true" fluid style={{ marginTop: '2.85714286em' }}>
                <Container fluid inverted="true" className="footer">
                    <audio ref={audio} />
                    <div style={{ color: "white", fontSize: 16 }}>
                        {!playing
                            ? <Icon size="large" name='play' style={{ color: "rgb(51, 51, 51)" }} />
                            : <Icon size="big" name='stop' onClick={handleClick.bind(this)} style={{ color: "white" }} />
                        }
                        {playing && `${result?.tags.artist} - ${result?.tags.title}`}
                        
                    </div>
                </Container>
                <TabMenu />
                <Switch>
                    <Route path="/settings">
                        <Settings />
                    </Route>
                    <Route path="/library">
                        <Library />
                    </Route>
                    <Route path="/stations">
                        <Stations />
                    </Route>
                    <Route path="/">
                        <Dashboard />
                    </Route>
                </Switch>
            </Container>
        </Router>
    )
}
ReactDOM.render(
    <Provider store={store}>
        <MainApp />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
