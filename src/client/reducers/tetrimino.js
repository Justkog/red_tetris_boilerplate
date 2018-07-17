import * as R from 'ramda';
import { KEY_DOWN } from '../actions/key'

const horizontallyMove = (state, direction) => {
	return R.evolve(R.__, state)({
		position: {x: R.add(direction)}
	});
};

const handleKey = (state, key) => {
	switch (key) {
		case 'ArrowLeft':
			return horizontallyMove(state, -1);
		case 'ArrowRight':
			return horizontallyMove(state, 1);
		default:
			return state;
	}
};

export default (state = { position: { x: 0, y: 0 } }, action) => {
	switch (action.type) {
		case KEY_DOWN:
			return handleKey(state, action.key);
		default:
			return state;
	}
};