import {configureStore} from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import chai, { expect } from "chai"
import * as R from 'ramda'
import { ROOMS_LIST_SHOW } from '../../src/server/tools/constants';
import sinon from 'sinon';
import { showRoomsList, registerRoomsListShow } from '../../src/client/actions/rooms';

chai.should()

describe('Rooms actions test', function(){
  it('should showRoomsList', function(){
    const expectedAction = {
      type: ROOMS_LIST_SHOW,
      rooms: ['test room']
    }
    expect(showRoomsList(['test room'])).to.be.eql(expectedAction)  
  })

  it('should registerRoomsListShow', function(){
    const socketOnStub = sinon.stub().callsFake((actionType, callback) => callback({}))
    // const getStateStub = sinon.stub().callsFake(() => ({room: {solo: true}}))
    const socket = {off: sinon.spy(), on: socketOnStub}
    const dispatchSpy = sinon.spy()
    registerRoomsListShow(socket, dispatchSpy)
    expect(socket.off.calledOnce).to.be.equal(true)
    expect(socket.on.calledOnce).to.be.equal(true)
    expect(dispatchSpy.callCount).to.be.equal(1)
  })
})