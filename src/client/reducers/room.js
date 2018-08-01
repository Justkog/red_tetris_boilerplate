import * as R from 'ramda'
import { ROOM_JOIN, SOLO_ROOM_JOIN } from "../actions/room";
import { ROOM_UPDATE, ROOM_LEAVE, PLAYERS_MESSAGE } from '../../server/tools/constants';

export default (state = {}, action) => {
	switch (action.type) {
        case ROOM_JOIN:
            return Object.assign({}, state, { name: action.name, solo: false })
        case SOLO_ROOM_JOIN:
            console.log('solo')
            return Object.assign({}, state, { solo: true })
        case ROOM_UPDATE:
            console.log('ROOM_UPDATE reduce')
            return Object.assign({}, state, { name: action.roomName, users: action.users })
        case PLAYERS_MESSAGE:
            let messages = (state.messages) ? state.messages.concat([action.message]) : [action.message];
            return Object.assign({}, state, { messages: messages })
        case ROOM_LEAVE:
            return {}
		default:
			return state
	}
}