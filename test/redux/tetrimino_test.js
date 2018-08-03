import {configureStore} from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import chai, { expect } from "chai"
import * as R from 'ramda'
import { Tetri } from '../../src/client/components/tetrimino/tetrimino';
import { addTetrimino, removeTetrimino, sealTetrimino, moveLeftTetrimino, moveRightTetrimino, moveDownTetrimino, moveUpTetrimino, rotateTetrimino } from '../../src/client/actions/tetrimino';
import reducer from '../../src/client/reducers/tetrimino'

const MESSAGE = "message"

chai.should()

describe('Tetrimino redux test', function(){
  it('should add tetrimino', function(done){
    const initialState = {}
    const store =  configureStore(rootReducer, null, initialState, {
        TETRIMINO_ADD: ({dispatch, getState}) =>  {
            const state = getState()
            console.log(state.activeTetrimino)
            expect(R.equals(state.activeTetrimino, 
                {
                    position: {x: 5, y: 0},
                    orientation: 0,
                    formType: Tetri.Types.Z,
                    id: 1,
                }
            )).to.equal(true)
            done()
        }
    })
    store.dispatch(addTetrimino({identifier: Tetri.Types.Z, rotation: 0}, 1))
  })

  it('should remove tetrimino', function(done){
    const initialState = {}
    const store =  configureStore(rootReducer, null, initialState, {
        TETRIMINO_REMOVE: ({dispatch, getState}) =>  {
            const state = getState()
            console.log(state.activeTetrimino)
            expect(R.isEmpty(state.activeTetrimino)).to.equal(true)
            done()
        }
    })
    store.dispatch(addTetrimino({identifier: Tetri.Types.Z, rotation: 0}, 1))
    store.dispatch(removeTetrimino())
  })

  it('should seal tetrimino', function(done){
    const initialState = {}
    const store =  configureStore(rootReducer, null, initialState, {
        TETRIMINO_SEAL: ({dispatch, getState}) =>  {
            const state = getState()
            console.log(state.activeTetrimino)
            expect(R.isEmpty(state.activeTetrimino)).to.equal(true)
            done()
        }
    })
    store.dispatch(addTetrimino({identifier: Tetri.Types.Z, rotation: 0}, 1))
    store.dispatch(sealTetrimino())
  })

  it('should move left tetrimino', function(done){
    const initialState = {}
    const store =  configureStore(rootReducer, null, initialState, {
        TETRIMINO_MOVE_LEFT: ({dispatch, getState}) =>  {
            const state = getState()
            console.log(state.activeTetrimino)
            expect(R.equals(state.activeTetrimino, 
                {
                    position: {x: 4, y: 0},
                    orientation: 0,
                    formType: Tetri.Types.Z,
                    id: 1,
                }
            )).to.equal(true)
            done()
        }
    })
    store.dispatch(addTetrimino({identifier: Tetri.Types.Z, rotation: 0}, 1))
    store.dispatch(moveLeftTetrimino())
  })

  it('should move right tetrimino', function(done){
    const initialState = {}
    const store =  configureStore(rootReducer, null, initialState, {
        TETRIMINO_MOVE_RIGHT: ({dispatch, getState}) =>  {
            const state = getState()
            console.log(state.activeTetrimino)
            expect(R.equals(state.activeTetrimino, 
                {
                    position: {x: 6, y: 0},
                    orientation: 0,
                    formType: Tetri.Types.Z,
                    id: 1,
                }
            )).to.equal(true)
            done()
        }
    })
    store.dispatch(addTetrimino({identifier: Tetri.Types.Z, rotation: 0}, 1))
    store.dispatch(moveRightTetrimino())
  })

  it('should move down tetrimino', function(done){
    const initialState = {}
    const store =  configureStore(rootReducer, null, initialState, {
        TETRIMINO_MOVE_DOWN: ({dispatch, getState}) =>  {
            const state = getState()
            console.log(state.activeTetrimino)
            expect(R.equals(state.activeTetrimino, 
                {
                    position: {x: 5, y: 1},
                    orientation: 0,
                    formType: Tetri.Types.Z,
                    id: 1,
                }
            )).to.equal(true)
            done()
        }
    })
    store.dispatch(addTetrimino({identifier: Tetri.Types.Z, rotation: 0}, 1))
    store.dispatch(moveDownTetrimino())
  })

  it('should move up tetrimino', function(done){
    const initialState = {}
    const store =  configureStore(rootReducer, null, initialState, {
        TETRIMINO_MOVE_UP: ({dispatch, getState}) =>  {
            const state = getState()
            console.log(state.activeTetrimino)
            expect(R.equals(state.activeTetrimino, 
                {
                    position: {x: 5, y: -1},
                    orientation: 0,
                    formType: Tetri.Types.Z,
                    id: 1,
                }
            )).to.equal(true)
            done()
        }
    })
    store.dispatch(addTetrimino({identifier: Tetri.Types.Z, rotation: 0}, 1))
    store.dispatch(moveUpTetrimino())
  })

  it('should rotate tetrimino', function(done){
    const initialState = {}
    const store =  configureStore(rootReducer, null, initialState, {
        TETRIMINO_ROTATE: ({dispatch, getState}) =>  {
            const state = getState()
            expect(R.equals(state.activeTetrimino, 
                {
                    position: {x: 5, y: 0},
                    orientation: 90,
                    formType: Tetri.Types.Z,
                    id: 1,
                }
            )).to.equal(true)
            done()
        }
    })
    store.dispatch(addTetrimino({identifier: Tetri.Types.Z, rotation: 0}, 1))
    store.dispatch(rotateTetrimino())
  })

  it('should return the initial state', () => {
    expect(R.equals(reducer(undefined, {}), {})).to.equal(true)
  })

  it('should rotate back to 0 tetrimino', function(done) {
    const tetriAdded = reducer({}, addTetrimino({identifier: Tetri.Types.Z, rotation: 0}, 1))
    const rotated1 = reducer(tetriAdded, rotateTetrimino())
    const rotated2 = reducer(rotated1, rotateTetrimino())
    const rotated3 = reducer(rotated2, rotateTetrimino())
    const rotated4 = reducer(rotated3, rotateTetrimino())
    
    expect(R.equals(rotated4, 
        {
            position: {x: 5, y: 0},
            orientation: 0,
            formType: Tetri.Types.Z,
            id: 1,
        }
    )).to.equal(true)
    done()
  })
})
