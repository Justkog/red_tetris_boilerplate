import {configureStore} from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import chai, { expect } from "chai"
import * as R from 'ramda'
import { updateBoard, resetBoard, addIndestructibleLines } from '../../src/client/actions/board'
import { Tetri } from '../../src/client/components/tetrimino/tetrimino';
import { updateBoardState, BoardN, RowN, indestructibleBlock } from '../../src/client/reducers/board';

const MESSAGE = "message"

chai.should()

describe('Board redux test', function(){
  it('should update board', function(done){
    const initialState = {}
    const store =  configureStore(rootReducer, null, initialState, {
      BOARD_UPDATE: ({dispatch, getState}) =>  {
        const state = getState()
        expect(R.equals(state.board, 
            updateBoardState(BoardN(25, 12, []), {currentActiveTetrimino: currentTetri})
        )).to.equal(true)
        done()
      }
    })

    const currentTetri = {
        position: {x: 5, y: 10},
        orientation: 0,
        formType: Tetri.Types.S,
        id: 1,
    }

    store.dispatch(updateBoard({}, currentTetri))
  })

  it('should reset board', function(done){
    const currentTetri = {
        position: {x: 5, y: 10},
        orientation: 0,
        formType: Tetri.Types.S,
        id: 1,
    }
    const initialState = {board: updateBoardState(BoardN(25, 12, []), {currentActiveTetrimino: currentTetri})}
    const store =  configureStore(rootReducer, null, initialState, {
      BOARD_RESET: ({dispatch, getState}) =>  {
        const state = getState()
        expect(R.equals(state.board, BoardN(25, 12, []))).to.equal(true)
        done()
      }
    })

    store.dispatch(resetBoard())
  })

  it('should add 3 indestructible lines', function(done){
    const currentTetri = {
        position: {x: 5, y: 10},
        orientation: 0,
        formType: Tetri.Types.S,
        id: 1,
    }
    const initialState = {board: updateBoardState(BoardN(25, 12, []), {currentActiveTetrimino: currentTetri})}
    const store =  configureStore(rootReducer, null, initialState, {
        INDESTRUCTIBLE_LINES_ADD: ({dispatch, getState}) =>  {
            const state = getState()
            expect(R.equals(state.board, updateBoardState(BoardN(25, 12, []), {currentActiveTetrimino: currentTetri}))).to.equal(false)
            expect(R.equals(R.last(R.init(state.board)), R.prepend([], R.append([], RowN(10, [indestructibleBlock()]))))).to.equal(true)
            done()
        }
    })
    store.dispatch(addIndestructibleLines({linesNumber: 3}))
  })
})
