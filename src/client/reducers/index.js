import { combineReducers } from 'redux'

import alert from './alert'
import keyBindings from './keyBindings'
import activeTetrimino from './tetrimino'
import game from './game'

export default combineReducers({
	alert,
	activeTetrimino,
	game
})




