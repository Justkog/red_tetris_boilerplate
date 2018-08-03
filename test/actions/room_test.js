import {configureStore} from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import chai, { expect } from "chai"
import * as R from 'ramda'
import { GAME_START, GAME_ERROR, NEXT_TETRI_REQUEST, PLAYER_END, ROOM_LEAVE, PLAYER_READY, ROOM_UPDATE } from '../../src/server/tools/constants';
import { startGame, GAME_STOP, stopGame, GAME_RESET, resetGame, pauseGame, GAME_PAUSE, resumeGame, GAME_RESUME, overGame, GAME_OVER, winGame, GAME_WIN, receiveGameError, registerLoopIntervalID, REGISTER_LOOP_INTERVAL_ID, registerKeyDownUnsubscriber, KEY_DOWN_UNSUBSCRIBE_REGISTER, requestGameStart, GAME_INIT, initGame, GAME_START_REQUEST, HEAD_TETRI_REMOVE, removeHeadTetri, requestNextTetri, tetrisUpdate, TETRIS_UPDATE, playerEnd, waitGameEnd, WAIT_GAME_END, requestGameStartAsync, pullHeadTetri, pullAndAddTetri, registerNextTetri, registerGameStart, registerPlayerEnd, waitGameEndAsync, registerGameError } from '../../src/client/actions/game';
import sinon from 'sinon';
import { addTetrimino } from '../../src/client/actions/tetrimino';
import { joinRoom, ROOM_JOIN, joinSoloRoom, SOLO_ROOM_JOIN, leaveRoom, readyPlayer, updateRoom, registerRoomUpdate } from '../../src/client/actions/room';

chai.should()

describe('Room actions test', function(){
  it('should joinRoom', function(){
    const expectedAction = {
      type: ROOM_JOIN,
      name: 'test room'
    }
    expect(joinRoom('test room')).to.be.eql(expectedAction)  
  })

  it('should joinSoloRoom', function(){
    const expectedAction = {
      type: SOLO_ROOM_JOIN,
    }
    expect(joinSoloRoom()).to.be.eql(expectedAction)  
  })

  it('should leaveRoom', function(){
    const expectedAction = {
      type: ROOM_LEAVE,
    }
    expect(leaveRoom()).to.be.eql(expectedAction)  
  })

  it('should readyPlayer', function(){
    const expectedAction = {
      type: PLAYER_READY,
    }
    expect(readyPlayer()).to.be.eql(expectedAction)  
  })

  it('should updateRoom', function(){
    const roomName = 'test room'
    const users = ['jc', 'lambda']
    const expectedAction = {
      type: ROOM_UPDATE,
      roomName: roomName,
      users: users
    }
    expect(updateRoom({ roomName, users })).to.be.eql(expectedAction)  
  })

  it('should registerRoomUpdate', function(){
    const socketOnStub = sinon.stub().callsFake((actionType, callback) => callback({}))
    const getStateStub = sinon.stub().callsFake(() => ({room: {solo: true}}))
    const socket = {off: sinon.spy(), on: socketOnStub}
    const dispatchSpy = sinon.spy()
    registerRoomUpdate(socket, dispatchSpy, getStateStub)
    expect(socket.off.calledOnce).to.be.equal(true)
    expect(socket.on.calledOnce).to.be.equal(true)
    expect(dispatchSpy.callCount).to.be.equal(1)
  })
})