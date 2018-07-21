import { combineReducers } from 'redux'
import * as R from 'ramda'

import alert from './alert'
import keyBindings from './keyBindings'
import activeTetrimino from './tetrimino'
import game from './game'
import board from './board'

export default (state = {}, action) => {
	return R.compose(
		R.merge(R.__, {
			activeTetrimino: activeTetrimino(state.activeTetrimino, action, state.board)
		}),
		combineReducers({
			alert,
			game,
			board,
			activeTetrimino: (state = {}) => state	// to silence the combineReducer warning, see https://stackoverflow.com/questions/33677833/react-redux-combining-reducers-unexpected-keys
		})
	)(state, action)
}