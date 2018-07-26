import * as R from 'ramda'
import { ROOM_JOIN } from "../actions/room";
import { ROOM_UPDATE } from '../../server/tools/constants';

export default (state = {}, action) => {
	switch (action.type) {
        case ROOM_JOIN:
            return Object.assign({}, state, { name: action.name })
        case ROOM_UPDATE:
            console.log('ROOM_UPDATE reduce')
            return Object.assign({}, state, { name: action.roomName, users: action.users })
		default:
			return state
	}
}