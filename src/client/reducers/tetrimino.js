import * as R from 'ramda'
import { KEY_DOWN } from '../actions/key'
import { LOOP_UPDATE } from '../actions/game'
import { TETRIMINO_ADD, TETRIMINO_REMOVE, TETRIMINO_SEAL, TETRIMINO_MOVE_RIGHT, TETRIMINO_MOVE_LEFT, TETRIMINO_MOVE_DOWN, TETRIMINO_ROTATE } from '../actions/tetrimino';
import { updateBoardState, isValidBoard, bordersMask } from './board';

const clampH = R.curry(R.clamp)(1, 10)
const clampV = R.curry(R.clamp)(0, 23)
const addClampH = R.compose(clampH, R.add)

// not needed anymore (kept as extra protection)
const addClampHTransformation = (direction) => R.curry(addClampH)(direction)
const addClampVTransformation = (direction) => R.curry(R.compose(clampV, R.add))(direction)

export const horizontallyMove = (state, direction) => {
	return R.evolve(R.__, state)({
		position: {x: addClampH(direction)}
	})
}

export const verticallyMove = (state, direction) => {
	return R.evolve(R.__, state)({
		position: {y: R.add(direction)}
	})
}

const resetOrientation = (orientation) => {
	if (orientation == 360)
		return 0;
	return orientation;
}

export const rotate = (state, angle) => {
	return R.evolve(R.__, state)({
		orientation: R.compose(resetOrientation, R.add(angle))
	})
}

const addNewTetri = (state, {position, orientation, formType}) => {
	return R.merge(R.__, state)({
		position: position ? position : {x: 5, y: 0},
		orientation: orientation ? orientation : 0,
		formType: formType,
		id: state.id ? state.id + 1 : 1,
	})
}

const removeTetri = (state, action) => {
	return {}
}

const sealTetri = (state, action) => {
	return {}
}

export default (state = {}, action, board) => {
	switch (action.type) {
		case TETRIMINO_ADD:
			return addNewTetri(state, action)
		case TETRIMINO_REMOVE:
			return removeTetri(state, action)
		case TETRIMINO_SEAL:
			return sealTetri(state, action)
		case TETRIMINO_MOVE_LEFT:
			return horizontallyMove(state, -1)
		case TETRIMINO_MOVE_RIGHT:
			return horizontallyMove(state, 1)
		case TETRIMINO_MOVE_DOWN:
			return verticallyMove(state, 1)
		case TETRIMINO_ROTATE:
			return rotate(state, 90)
		default:
			return state
	}
}