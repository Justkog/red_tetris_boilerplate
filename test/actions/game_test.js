import {configureStore} from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import chai, { expect } from "chai"
import * as R from 'ramda'
import { GAME_START, GAME_ERROR, NEXT_TETRI_REQUEST, PLAYER_END } from '../../src/server/tools/constants';
import { startGame, GAME_STOP, stopGame, GAME_RESET, resetGame, pauseGame, GAME_PAUSE, resumeGame, GAME_RESUME, overGame, GAME_OVER, winGame, GAME_WIN, receiveGameError, registerLoopIntervalID, REGISTER_LOOP_INTERVAL_ID, registerKeyDownUnsubscriber, KEY_DOWN_UNSUBSCRIBE_REGISTER, requestGameStart, GAME_INIT, initGame, GAME_START_REQUEST, HEAD_TETRI_REMOVE, removeHeadTetri, requestNextTetri, tetrisUpdate, TETRIS_UPDATE, playerEnd, waitGameEnd, WAIT_GAME_END, requestGameStartAsync, pullHeadTetri, pullAndAddTetri, registerNextTetri, registerGameStart, registerPlayerEnd, waitGameEndAsync, registerGameError } from '../../src/client/actions/game';
import sinon from 'sinon';
import { addTetrimino } from '../../src/client/actions/tetrimino';

chai.should()

describe('Game actions test', function(){
  it('should startGame', function(){
    const expectedAction = {
      type: GAME_START,
    }
    expect(R.equals(startGame(), expectedAction)).to.equal(true)
  })

  it('should stopGame', function(){
    const expectedAction = {
      type: GAME_STOP,
    }
    expect(R.equals(stopGame(), expectedAction)).to.equal(true)
  })

  it('should resetGame', function(){
    const expectedAction = {
      type: GAME_RESET,
    }
    expect(R.equals(resetGame(), expectedAction)).to.equal(true)
  })

  it('should pauseGame', function(){
    const expectedAction = {
      type: GAME_PAUSE,
    }
    expect(R.equals(pauseGame(), expectedAction)).to.equal(true)
  })

  it('should resumeGame', function(){
    const expectedAction = {
      type: GAME_RESUME,
    }
    expect(R.equals(resumeGame(), expectedAction)).to.equal(true)
  })

  it('should overGame', function(){
    const expectedAction = {
      type: GAME_OVER,
    }
    expect(R.equals(overGame(), expectedAction)).to.equal(true)
  })

  it('should winGame', function(){
    const expectedAction = {
      type: GAME_WIN,
    }
    expect(R.equals(winGame(), expectedAction)).to.equal(true)
  })

  it('should receiveGameError', function(){
    const expectedAction = {
      type: GAME_ERROR,
      message: 'error'
    }
    expect(R.equals(receiveGameError({message: 'error'}), expectedAction)).to.equal(true)
  })

  it('should registerLoopIntervalID', function(){
    const expectedAction = {
      type: REGISTER_LOOP_INTERVAL_ID,
      loopIntervalID: 42
    }
    expect(R.equals(registerLoopIntervalID(42), expectedAction)).to.equal(true)
  })

  it('should registerKeyDownUnsubscriber', function(){
    const unsubscribe = () => {}
    const expectedAction = {
      type: KEY_DOWN_UNSUBSCRIBE_REGISTER,
      unsubscribe: unsubscribe
    }
    expect(R.equals(registerKeyDownUnsubscriber(unsubscribe), expectedAction)).to.equal(true)
  })

  it('should requestGameStart', function(){
    const expectedAction = {
      type: GAME_START_REQUEST,
    }
    expect(R.equals(requestGameStart(), expectedAction)).to.equal(true)
  })

  it('should initGame', function(){
    const boards = []
    const tetris = []
    const expectedAction = {
        type: GAME_INIT,
        boards: boards,
        tetris: tetris,
    }
    expect(R.equals(initGame({boards, tetris}), expectedAction)).to.equal(true)
  })

  it('should removeHeadTetri', function(){
    const expectedAction = {
        type: HEAD_TETRI_REMOVE,
    }
    expect(R.equals(removeHeadTetri(), expectedAction)).to.equal(true)
  })

  it('should requestNextTetri', function(){
    const expectedAction = {
        type: NEXT_TETRI_REQUEST,
    }
    expect(R.equals(requestNextTetri(), expectedAction)).to.equal(true)
  })

  it('should tetrisUpdate', function(){
    const tetris = []
    const expectedAction = {
        type: TETRIS_UPDATE,
        tetris: tetris,
    }
    expect(R.equals(tetrisUpdate({tetris}), expectedAction)).to.equal(true)
  })

  it('should playerEnd', function(){
    const users = []
    const game_finished = false
    const expectedAction = {
        type: PLAYER_END,
        users: users,
	    game_finished: game_finished,
    }
    expect(R.equals(playerEnd({users, game_finished}), expectedAction)).to.equal(true)
  })

  it('should waitGameEnd', function(){
    const expectedAction = {
        type: WAIT_GAME_END,
    }
    expect(R.equals(waitGameEnd(), expectedAction)).to.equal(true)
  })

  it('should requestGameStartAsync', function(){
    const expectedAction = requestGameStart()
    const emitSpy = sinon.spy()
    const dispatchSpy = sinon.spy()
    const getStateStub = sinon.stub().callsFake(() => ({socket: {emit: emitSpy}}))
    requestGameStartAsync('test room')(dispatchSpy, getStateStub)
    expect(dispatchSpy.withArgs(expectedAction).calledOnce).to.be.equal(true)
    expect(emitSpy.withArgs(GAME_START, {roomName: 'test room'}).calledOnce).to.be.equal(true)
  })

  it('should pullHeadTetri', function(){
    const expectedAction = removeHeadTetri()
    const emitSpy = sinon.spy()
    const dispatchSpy = sinon.spy()
    const getStateStub = sinon.stub().callsFake(() => ({socket: {emit: emitSpy}, game: {tetris: ['tetri1', 'tetri2', 'tetri3', 'tetri4']}}))
    const tetri = pullHeadTetri()(dispatchSpy, getStateStub)
    expect(dispatchSpy.withArgs(expectedAction).calledOnce).to.be.equal(true)
    expect(dispatchSpy.calledTwice).to.be.equal(true)
    expect(tetri).to.be.equal('tetri1')
  })

  it('should pullAndAddTetri', function(){
    const expectedAction = addTetrimino('tetri1', 1)
    const emitSpy = sinon.spy()
    const dispatchSpy = sinon.stub().callsFake(() => 'tetri')
    const getStateStub = sinon.stub().callsFake(() => ({socket: {emit: emitSpy}, game: {lastTetriID: 1, tetris: ['tetri1', 'tetri2', 'tetri3', 'tetri4']}}))
    pullAndAddTetri()(dispatchSpy, getStateStub)
    expect(dispatchSpy.calledTwice).to.be.equal(true)
  })

  it('should pullAndNotAddTetri', function(){
    const expectedAction = addTetrimino('tetri1', 1)
    const emitSpy = sinon.spy()
    const dispatchSpy = sinon.spy()
    const getStateStub = sinon.stub().callsFake(() => ({socket: {emit: emitSpy}, game: {lastTetriID: 1, tetris: ['tetri1', 'tetri2', 'tetri3', 'tetri4']}}))
    pullAndAddTetri()(dispatchSpy, getStateStub)
    expect(dispatchSpy.calledOnce).to.be.equal(true)
  })

  it('should registerNextTetri', function(){
    const socketOnStub = sinon.stub().callsFake((actionType, callback) => callback({tetris: ['tetri']}))
    const socket = {off: sinon.spy(), on: socketOnStub}
    const dispatchSpy = sinon.spy()
    registerNextTetri(socket, dispatchSpy)
    expect(socket.off.calledOnce).to.be.equal(true)
    expect(socket.on.calledOnce).to.be.equal(true)
    expect(dispatchSpy.calledOnce).to.be.equal(true)
  })

  it('should registerGameStart', function(){
    const socketOnStub = sinon.stub().callsFake((actionType, callback) => callback({tetris: ['tetri']}))
    const socket = {off: sinon.spy(), on: socketOnStub}
    const dispatchSpy = sinon.spy()
    registerGameStart(socket, dispatchSpy)
    expect(socket.off.calledOnce).to.be.equal(true)
    expect(socket.on.calledOnce).to.be.equal(true)
    expect(dispatchSpy.callCount).to.be.equal(5)
  })

  it('should registerPlayerEnd', function(){
    const socketOnStub = sinon.stub().callsFake((actionType, callback) => callback({tetris: ['tetri']}))
    const socket = {off: sinon.spy(), on: socketOnStub}
    const dispatchSpy = sinon.spy()
    registerPlayerEnd(socket, dispatchSpy)
    expect(socket.off.calledOnce).to.be.equal(true)
    expect(socket.on.calledOnce).to.be.equal(true)
    expect(dispatchSpy.callCount).to.be.equal(1)
  })

  it('should registerGameError', function(){
    const socketOnStub = sinon.stub().callsFake((actionType, callback) => callback({tetris: ['tetri']}))
    const socket = {off: sinon.spy(), on: socketOnStub}
    const dispatchSpy = sinon.spy()
    registerGameError(socket, dispatchSpy)
    expect(socket.off.calledOnce).to.be.equal(true)
    expect(socket.on.calledOnce).to.be.equal(true)
    expect(dispatchSpy.callCount).to.be.equal(1)
  })

  it('should waitGameEndAsync', function(){
    const dispatchSpy = sinon.spy()
    waitGameEndAsync()(dispatchSpy)
    expect(dispatchSpy.callCount).to.be.equal(1)
  })
})