import { combineReducers } from 'redux';
import { CHANGE_SONG } from './actions';


function songs(state: any = null, action) {
    switch (action.type) {
        case CHANGE_SONG:
            return action;
        default:
            return state
    }
}

export default combineReducers({ songs });