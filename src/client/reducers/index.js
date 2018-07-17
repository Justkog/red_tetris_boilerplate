import { combineReducers } from 'redux'

import alert from './alert'
import keyBindings from './keyBindings'
import activeTetrimino from './tetrimino'

export default combineReducers({
	alert,
	activeTetrimino
});




