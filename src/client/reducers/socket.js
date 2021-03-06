import { SOCKET_CONNECT, SOCKET_DISCONNECTED } from "../actions/socket";
import * as R from 'ramda'

export default (state = {}, action) => {
	switch (action.type) {
		case SOCKET_CONNECT:
			return action.socket
		default:
			return state;
	}
};