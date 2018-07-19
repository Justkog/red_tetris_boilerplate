import { START_GAME, LOOP_UPDATE, STOP_GAME, REGISTER_LOOP_INTERVAL_ID } from '../actions/game'
import { KEY_DOWN } from '../actions/key'
import * as R from 'ramda'

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

export default (state = {started: false, loopIntervalID: 0}, action) => {
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
			return R.merge(state, {loopIntervalID: action.loopIntervalID})
		case KEY_DOWN:
			return handleKey(state, action.key)
		default:
			return state
	}
}