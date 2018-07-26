import * as R from 'ramda'
import { ROOM_JOIN } from "../actions/room";

export default (state = {}, action) => {
	switch (action.type) {
        case ROOM_JOIN:
			return Object.assign({}, state, { name: action.name })
		default:
			return state
	}
}