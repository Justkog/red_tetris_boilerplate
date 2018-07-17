import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'                                                                                                                                                    
import {storeStateMiddleWare} from './middleware/storeStateMiddleWare'
import reducer from './reducers'
import App from './containers/app'
import {alert} from './actions/alert'
import { keyDown } from './actions/key'
import * as R from 'ramda';

import 'bootstrap/dist/css/bootstrap.min.css';

const initialState = {}

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(thunk, createLogger())
)

ReactDom.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('tetris'))

store.dispatch(alert('Soon, will be here a fantastic Tetris ...'))
store.dispatch(alert('Soon, will be here a fantastic Tetris ... 2'))

// test
store.dispatch(keyDown({key: 'ArrowRight'}));

const allowedKeys = [
	'ArrowUp',
	'ArrowLeft',
	'ArrowRight',
	'ArrowDown',
];

// thunk action creator, needs redux-thunk
function listenToWindowEvent(name, mapEventToAction, filter = (e) => R.contains(e.key, allowedKeys)) {
	return function (dispatch) {
	  function handleEvent(e) {
		if (filter(e)) {
		  dispatch(mapEventToAction(e));
		}
	  }
  
	  window.addEventListener(name, handleEvent);
  
	  // note: returns a function to unsubscribe
	  return () => window.removeEventListener(name, handleEvent);
	};
  }
  
  // subscribe to event
  let unlistenkeyDown = store.dispatch(listenToWindowEvent('keydown', keyDown));

  

  // eventually unsubscribe
//   unlistenkeyDown();