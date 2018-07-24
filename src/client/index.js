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
import { startGameLoop } from './actions/game'
import { keyDown, listenToWindowEvent, keyDownDispatcher } from './actions/key'
import * as R from 'ramda'

import 'bootstrap/dist/css/bootstrap.min.css'
import { boardManager } from './middleware/boardManager';
import { addTetrimino } from './actions/tetrimino';
import { listenBoardUpdate } from './actions/gameEvents';
import { connectSocket, startSocket, registerTests, registerSocketEvent } from './actions/socket';
import { registerRoomsListShow } from './actions/rooms';
import { test_socket_io } from './components/test_socket_io';

const initialState = {}

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(thunk, createLogger(), gameLoopManager, boardManager)
)

ReactDom.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('tetris'))

store.dispatch(startSocket())
store.dispatch(registerSocketEvent(test_socket_io))
// store.dispatch(registerRoomsListShow())
store.dispatch(listenBoardUpdate(store))
store.dispatch(alert('Soon, will be here a fantastic Tetris ...'))
store.dispatch(alert('Soon, will be here a fantastic Tetris ... 2'))
// store.dispatch(startGameLoop())

// test
store.dispatch(keyDown({key: 'ArrowRight'}))
store.dispatch(addTetrimino())

// subscribe to event
let unlistenkeyDown = store.dispatch(listenToWindowEvent('keydown', keyDownDispatcher))

 // eventually unsubscribe
//   unlistenkeyDown()