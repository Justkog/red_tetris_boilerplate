import {configureStore} from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import chai, { expect } from "chai"
import * as R from 'ramda'
import { ROOMS_LIST_SHOW, UPDATE_SCORE } from '../../src/server/tools/constants';
import sinon from 'sinon';
import { showRoomsList, registerRoomsListShow } from '../../src/client/actions/rooms';
import { scoreUpdate, registerScoreUpdate } from '../../src/client/actions/score';

chai.should()

describe('Score actions test', function(){
  it('should scoreUpdate', function(){
    const expectedAction = {
      type: UPDATE_SCORE,
      scores: {jc: 42, lambda: 9001}
    }
    expect(scoreUpdate({scores: {jc: 42, lambda: 9001}})).to.be.eql(expectedAction)  
  })

  it('should registerScoreUpdate', function(){
    const socketOnStub = sinon.stub().callsFake((actionType, callback) => callback({}))
    // const getStateStub = sinon.stub().callsFake(() => ({room: {solo: true}}))
    const socket = {off: sinon.spy(), on: socketOnStub}
    const dispatchSpy = sinon.spy()
    registerScoreUpdate(socket, dispatchSpy)
    expect(socket.off.calledOnce).to.be.equal(true)
    expect(socket.on.calledOnce).to.be.equal(true)
    expect(dispatchSpy.callCount).to.be.equal(1)
  })
})