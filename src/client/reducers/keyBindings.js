import { KEY_DOWN } from '../actions/key'

export default (state = {}, action) => {
	switch (action.type) {
		case KEY_DOWN:
			return { downedKey: action.key };
		default:
			return state;
	}
};