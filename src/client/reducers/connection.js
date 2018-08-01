import { SOCKET_CONNECT, SOCKET_DISCONNECTED, SOCKET_CONNECTED } from "../actions/socket";
import * as R from 'ramda'

export default (state = {}, action) => {
	switch (action.type) {
        case SOCKET_CONNECTED:
			return Object.assign({}, state, { status: 'connected' })
		case SOCKET_DISCONNECTED:
			return Object.assign({}, state, { status: 'disconnected' })
		default:
			return state;
	}
};