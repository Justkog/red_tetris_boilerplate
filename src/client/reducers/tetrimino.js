import * as R from 'ramda'
import { KEY_DOWN } from '../actions/key'
import { LOOP_UPDATE } from '../actions/game'

const clampH = R.curry(R.clamp)(0, 9)
const clampV = R.curry(R.clamp)(0, 19)
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

const rotate = (state, angle) => {
	return R.evolve(R.__, state)({
		orientation: R.add(angle)
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

export default (state = { position: { x: 0, y: 0 }, orientation: 0 }, action) => {
	switch (action.type) {
		case KEY_DOWN:
			return handleKey(state, action.key)
		case LOOP_UPDATE:
			return verticallyMove(state, 1)
		default:
			return state
	}
}