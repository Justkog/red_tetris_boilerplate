import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'                                                                                                                                                    
import { storeStateMiddleWare } from './middleware/storeStateMiddleWare'
import { gameLoopManager } from './middleware/gameLoopManager'
import reducer from './reducers'
import App, { history } from './containers/app'
import { popAlert, registerPlayerError } from './actions/alert'
import { registerChatUpdate } from './actions/chat'
import { startGameLoop, registerGameStart, registerNextTetri, registerPlayerEnd, registerGameError, overGame, stopGame, getGame } from './actions/game'
import { keyDown, listenToWindowEvent, keyDownDispatcher } from './actions/key'
import * as R from 'ramda'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { boardManager } from './middleware/boardManager';
import { addTetrimino } from './actions/tetrimino';
import { listenBoardUpdate } from './actions/gameEvents';
import { connectSocket, startSocket, registerTests, registerSocketEvent } from './actions/socket';
import { registerRoomsListShow } from './actions/rooms';
import { setLogin, resetLogin } from './actions/user';
import { joinRoom, joinRoomAsync, registerRoomUpdate, leaveRoomAsync } from './actions/room';
import { hashUrlRegex } from './containers/internalRouter';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from './epics/root';
import { registerIndestructibleLinesAdd } from './actions/board';
import { registerScoreUpdate } from './actions/score';
import { registerSpectrumUpdate } from './actions/spectre';

const initialState = {}

const hashSetup = (store) => {
	console.log('hash setup', window.location.hash)
	console.log(hashUrlRegex.test(window.location.hash))	
	if (hashUrlRegex.test(window.location.hash)) {
		const urlLogin = window.location.hash.match(hashUrlRegex)[2]
		const urlRoom = window.location.hash.match(hashUrlRegex)[1]
		store.dispatch(setLogin(urlLogin))
		if (R.propEq('started', true)(getGame(store.getState()))) {
			store.dispatch(overGame())
			store.dispatch(stopGame())
		}
		if (!R.isEmpty(store.getState().room))
			store.dispatch(leaveRoomAsync())
		store.dispatch(joinRoomAsync(urlRoom))
	} else {
		console.log('reset login')
		// window.location.hash = ''
		store.dispatch(resetLogin())
	}
}

window.onhashchange = () => {
	console.log('hash change!', window.location.hash)
	hashSetup(store)
};


const epicMiddleware = createEpicMiddleware();

export const store = createStore(
	reducer,
	initialState,
	applyMiddleware(thunk, epicMiddleware, createLogger(), gameLoopManager, boardManager)
)


epicMiddleware.run(rootEpic);

// Listen for changes to the current location.
const unlisten = history.listen((location, action) => {
	console.log(action, location.pathname, location.state)
	// location is an object like window.location
	if (action === 'POP' && location.pathname === '/rooms') {
		if (!R.isEmpty(store.getState().room))
			store.dispatch(leaveRoomAsync())
		if (R.propEq('started', true)(getGame(store.getState()))) {
			store.dispatch(overGame())
			store.dispatch(stopGame())
		}
	}
})

store.dispatch(startSocket())
hashSetup(store)

ReactDom.render((
	<Provider store={store}>
		<App/>
	</Provider>
), document.getElementById('tetris'))

store.dispatch(registerSocketEvent(registerRoomsListShow))
store.dispatch(registerSocketEvent(registerRoomUpdate))
store.dispatch(registerSocketEvent(registerGameStart))
store.dispatch(registerSocketEvent(registerNextTetri))
store.dispatch(registerSocketEvent(registerScoreUpdate))
store.dispatch(registerSocketEvent(registerIndestructibleLinesAdd))
store.dispatch(registerSocketEvent(registerPlayerEnd))
store.dispatch(registerSocketEvent(registerSpectrumUpdate))
store.dispatch(registerSocketEvent(registerGameError))
store.dispatch(registerSocketEvent(registerPlayerError))
store.dispatch(registerSocketEvent(registerChatUpdate))
store.dispatch(listenBoardUpdate(store))
// store.dispatch(popAlert('Soon, will be here a fantastic Tetris ...'))
// store.dispatch(popAlert('Soon, will be here a fantastic Tetris ... 2'))
// store.dispatch(startGameLoop())

// test
// store.dispatch(keyDown({key: 'ArrowRight'}))
// store.dispatch(addTetrimino())

// subscribe to event
// let unlistenkeyDown = store.dispatch(listenToWindowEvent('keydown', keyDownDispatcher))

 // eventually unsubscribe
//   unlistenkeyDown()