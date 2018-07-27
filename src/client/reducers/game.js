import { START_GAME, LOOP_UPDATE, STOP_GAME, REGISTER_LOOP_INTERVAL_ID, GAME_INIT, KEY_DOWN_UNSUBSCRIBE_REGISTER, HEAD_TETRI_REMOVE, TETRIS_UPDATE } from '../actions/game'
import { KEY_DOWN } from '../actions/key'
import * as R from 'ramda'
import { TETRIMINO_ADD } from '../actions/tetrimino';

const handleKey = (state, key) => {
	switch (key) {
		case 'p':
			return R.evolve(R.__, state)({
				started: R.not
			})
		default:
			return state
	}
}

export default (state = {started: false, loopIntervalID: 0, lastTetriID: 1}, action) => {
	switch (action.type) {
		case START_GAME:
			return R.evolve(R.__, state)({
				started: R.T
			})
		case STOP_GAME:
			return R.evolve(R.__, state)({
				started: R.F
			})
		case REGISTER_LOOP_INTERVAL_ID:
			return Object.assign({}, state, {loopIntervalID: action.loopIntervalID})
		case KEY_DOWN:
			return handleKey(state, action.key)
		case GAME_INIT:
			return Object.assign({}, state, {tetris: action.tetris, boards: action.boards})
		case KEY_DOWN_UNSUBSCRIBE_REGISTER:
			return Object.assign({}, state, {keydownUnsubscribe: action.unsubscribe})
		case HEAD_TETRI_REMOVE:
			return R.evolve(R.__, state)({
				tetris: R.tail
			})
		case TETRIS_UPDATE:
			return R.evolve(R.__, state) ({
				tetris: R.concat(R.__, action.tetris)
			})
		case TETRIMINO_ADD:
			return R.evolve(R.__, state) ({
				lastTetriID: R.inc
			})
		default:
			return state
	}
}