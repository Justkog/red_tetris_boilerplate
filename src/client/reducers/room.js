import * as R from 'ramda'
import { ROOM_JOIN, SOLO_ROOM_JOIN } from "../actions/room";
import { ROOM_UPDATE } from '../../server/tools/constants';

export default (state = {}, action) => {
	switch (action.type) {
        case ROOM_JOIN:
            return Object.assign({}, state, { name: action.name })
        case SOLO_ROOM_JOIN:
            console.log('solo')
            return Object.assign({}, state, { solo: true })
        case ROOM_UPDATE:
            console.log('ROOM_UPDATE reduce')
            return Object.assign({}, state, { name: action.roomName, users: action.users })
		default:
			return state
	}
}