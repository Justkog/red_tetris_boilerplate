import * as R from 'ramda'
import { KEY_DOWN } from '../actions/key'
import { LOOP_UPDATE } from '../actions/game'
import { TETRIMINO_ADD, TETRIMINO_REMOVE } from '../actions/tetrimino';
import { updateBoardState } from './board';

const clampH = R.curry(R.clamp)(1, 10)
const clampV = R.curry(R.clamp)(0, 23)
const addClampH = R.compose(clampH, R.add)

const addClampHTransformation = (direction) => R.curry(addClampH)(direction)
const addClampVTransformation = (direction) => R.curry(R.compose(clampV, R.add))(direction)

const horizontallyMove = (state, direction) => {
	return R.evolve(R.__, state)({
		position: {x: addClampHTransformation(direction)}
	})
}

const verticallyMove = (state, direction) => {
	return R.evolve(R.__, state)({
		position: {y: addClampVTransformation(direction)}
	})
}

const resetOrientation = (orientation) => {
	if (orientation == 360)
		return 0;
	return orientation;
}

const rotate = (state, angle) => {
	return R.evolve(R.__, state)({
		orientation: R.compose(resetOrientation, R.add(angle))
	})
}

const handleKey = (state, key) => {
	switch (key) {
		case 'ArrowLeft':
			return horizontallyMove(state, -1)
		case 'ArrowRight':
			return horizontallyMove(state, 1)
		case 'ArrowDown':
			return verticallyMove(state, 1)
		case 'ArrowUp':
			return rotate(state, 90)
		default:
			return state
	}
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

export default (state = {}, action, board) => {
	switch (action.type) {
		case TETRIMINO_ADD:
			return addNewTetri(state, action)
		case TETRIMINO_REMOVE:
			return removeTetri(state, action)
		case KEY_DOWN:
			console.dir(board)
			console.dir({prevActiveTetrimino: state, currentActiveTetrimino: handleKey(state, action.key)})
			const futureBoard = updateBoardState(board, {prevActiveTetrimino: state, currentActiveTetrimino: handleKey(state, action.key)})
			console.dir(futureBoard)
			return handleKey(state, action.key)
		case LOOP_UPDATE:
			return verticallyMove(state, 1)
		default:
			return state
	}
}