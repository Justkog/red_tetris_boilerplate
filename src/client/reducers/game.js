import { LOOP_UPDATE, REGISTER_LOOP_INTERVAL_ID, GAME_INIT, KEY_DOWN_UNSUBSCRIBE_REGISTER, HEAD_TETRI_REMOVE, TETRIS_UPDATE, GAME_PAUSE, GAME_RESUME, GAME_STOP, GAME_OVER, GAME_WIN } from '../actions/game'
import { KEY_DOWN } from '../actions/key'
import * as R from 'ramda'
import { TETRIMINO_ADD } from '../actions/tetrimino';
import { UPDATE_SCORE } from '../../server/tools/constants';
import { GAME_START } from '../../server/tools/constants';

const handleKey = (state, key) => {
	switch (key) {
		case 's':
			return R.evolve(R.__, state)({
				started: R.not
			})
		default:
			return state
	}
}

export default (state = {started: false, paused: false, loopIntervalID: 0, lastTetriID: 1}, action) => {
	switch (action.type) {
		case GAME_START:
			return R.evolve(R.__, state)({
				started: R.T
			})
		case GAME_STOP:
			return R.evolve(R.__, state)({
				started: R.F
      		})
    	case UPDATE_SCORE:
      		return Object.assign({}, state, { scores: action.scores })
		case GAME_PAUSE:
			return R.evolve(R.__, state)({
				paused: R.T
			})
		case GAME_RESUME:
			return R.evolve(R.__, state)({
				paused: R.F
			})
		case GAME_OVER:
			return Object.assign({}, state, {victorious: false})
		case GAME_WIN:
			return Object.assign({}, state, {victorious: true})
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