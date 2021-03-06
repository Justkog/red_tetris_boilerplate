import * as server from '../../src/server/index'
import Supervisor from '../../src/server/classes/Supervisor';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

export const startServer = (params, supervisor, cb) => {
  server.create(params, supervisor)
    .then( s => cb(null, s) )
    .catch( err => cb(err) )
}

export const configureStore = (reducer, socket, initialState, types) => createStore( 
  reducer,
  initialState,
  applyMiddleware(
    myMiddleware(types),
    socketIoMiddleWare(socket),
    thunk
  )
)

const isFunction = arg => { return typeof arg === 'function' }

const myMiddleware = (types={}) => {
  const fired = {}
  return store => next => action => {
    const result = next(action)
    const cb = types[action.type]
    if(cb && !fired[action.type]){
      if(!isFunction(cb)) throw new Error("action's type value must be a function")
      fired[action.type] = true
      cb({getState: store.getState, dispatch: store.dispatch, action})
    }
    return result
  }
}

const socketIoMiddleWare = socket => ({dispatch, getState}) => {
  if(socket) socket.on('game_creation', dispatch)
  return next => action => {
    console.log('action: ', action);
    if(socket && action.type && action.type.indexOf('server/') === 0) socket.emit('action', action)
    return next(action)
  }
}
