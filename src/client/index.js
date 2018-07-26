import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'                                                                                                                                                    
import { storeStateMiddleWare } from './middleware/storeStateMiddleWare'
import { gameLoopManager } from './middleware/gameLoopManager'
import reducer from './reducers'
import App from './containers/app'
import { alert } from './actions/alert'
import { startGameLoop, registerGameStart } from './actions/game'
import { keyDown, listenToWindowEvent, keyDownDispatcher } from './actions/key'
import * as R from 'ramda'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { boardManager } from './middleware/boardManager';
import { addTetrimino } from './actions/tetrimino';
import { listenBoardUpdate } from './actions/gameEvents';
import { connectSocket, startSocket, registerTests, registerSocketEvent } from './actions/socket';
import { registerRoomsListShow } from './actions/rooms';
import { test_socket_io } from './components/test_socket_io';
import { setLogin } from './actions/user';
import { joinRoom, joinRoomAsync, registerRoomUpdate } from './actions/room';
import { hashUrlRegex } from './containers/internalRouter';

const initialState = {}

const hashSetup = (store) => {
	console.log('hash setup', window.location.hash)
	if (hashUrlRegex.test(window.location.hash)) {
		const urlLogin = window.location.hash.match(hashUrlRegex)[2]
		const urlRoom = window.location.hash.match(hashUrlRegex)[1]
		store.dispatch(setLogin(urlLogin))
		store.dispatch(joinRoomAsync(urlRoom))
	}
}

window.onhashchange = () => {
	console.log('hash change!', window.location.hash)
	hashSetup(store)
};

const store = createStore(
	reducer,
	initialState,
	applyMiddleware(thunk, createLogger(), gameLoopManager, boardManager)
)

store.dispatch(startSocket())
hashSetup(store)

ReactDom.render((
	<Provider store={store}>
		<App/>
	</Provider>
), document.getElementById('tetris'))

store.dispatch(registerSocketEvent(test_socket_io))
store.dispatch(registerSocketEvent(registerRoomsListShow))
store.dispatch(registerSocketEvent(registerRoomUpdate))
store.dispatch(registerSocketEvent(registerGameStart))
store.dispatch(listenBoardUpdate(store))
store.dispatch(alert('Soon, will be here a fantastic Tetris ...'))
store.dispatch(alert('Soon, will be here a fantastic Tetris ... 2'))
// store.dispatch(startGameLoop())

// test
// store.dispatch(keyDown({key: 'ArrowRight'}))
// store.dispatch(addTetrimino())
// test_socket_io();

// subscribe to event
// let unlistenkeyDown = store.dispatch(listenToWindowEvent('keydown', keyDownDispatcher))

 // eventually unsubscribe
//   unlistenkeyDown()