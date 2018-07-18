import * as R from 'ramda';
import { KEY_DOWN } from '../actions/key'

// const addClamp = R.clamp(0, 9)(R.add(R.__, R.__))
const clampH = R.curry(R.clamp)(0, 9)
const addClamp = clampH(R.add)

const horizontallyMove = (state, direction) => {
	console.dir(addClamp(direction, state.position.x))
	let newpos = clampH(R.add(direction)(state.position.x))
	console.dir(newpos)
	
	console.dir(clampH(newpos))
	return R.evolve(R.__, state)({
		position: {x: addClamp(direction)}
	});
};

const verticallyMove = (state, direction) => {
	return R.evolve(R.__, state)({
		position: {y: R.add(direction)}
	});
};

const handleKey = (state, key) => {
	switch (key) {
		case 'ArrowLeft':
			return horizontallyMove(state, -1);
		case 'ArrowRight':
			return horizontallyMove(state, 1);
		case 'ArrowDown':
			return verticallyMove(state, 1);
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