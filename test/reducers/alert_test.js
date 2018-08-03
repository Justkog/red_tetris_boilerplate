import {configureStore} from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import {popAlert} from '../../src/client/actions/alert'
import chai, { expect } from "chai"
import { depopAlert } from '../../src/client/actions/alert';
import * as R from 'ramda'

const MESSAGE = "message"

chai.should()

describe('Alert redux test', function(){
  it('alert pop', function(done){
    const initialState = {}
    const store =  configureStore(rootReducer, null, initialState, {
      ALERT_POP: ({dispatch, getState}) =>  {
        const state = getState()
        state.alert[0].message.should.equal(MESSAGE)
        done()
      }
    })
    store.dispatch(popAlert({message: MESSAGE}))
  });

  it('alert depop', function(done){
    const initialState = {alert: [{message: 'test message'}]}
    const store =  configureStore(rootReducer, null, initialState, {
      ALERT_DEPOP: ({dispatch, getState}) =>  {
        const state = getState()
        expect(state.alert).to.be.eql([])
        done()
      }
    })
    store.dispatch(depopAlert())
  });

  it('alert default', function(done){
    const initialState = {alert: [{message: 'test message'}]}
    const store =  configureStore(rootReducer, null, initialState, {
      ALERT_YOUHOU: ({dispatch, getState}) =>  {
        const state = getState()
        expect(R.equals(initialState.alert, state.alert)).to.equal(true)
        done()
      }
    })
    store.dispatch({
        type: 'ALERT_YOUHOU',
      })
  });

});
