import chai from "chai"
import React from 'react'
import equalJSX from 'chai-equal-jsx'
import {createRenderer} from 'react-addons-test-utils'
import { AlertComponent } from "../../src/client/components/alert/alert";
import { Alert, Container } from 'reactstrap'

// import {configureStore} from '../helpers/server'
// import rootReducer from '../../src/client/reducers'
// import { Provider } from 'react-redux'

chai.should()
chai.use(equalJSX)

describe('AlertNotifier react test', function(){

  // issue with window as it goes all the way up to alert actions containing an App import
  // it('works', function(){
  //   const initialState = {}
  //   const store =  configureStore(rootReducer, null, initialState, {
  //     ALERT_POP: ({dispatch, getState}) =>  {
  //       const state = getState()
  //       state.message.should.equal(MESSAGE)
  //       done()
  //     }
  //   })
  //   const renderer = createRenderer()
  //   // renderer.render(React.createElement(AlertNotifier))
  //   renderer.render(
  //     <Provider store={store}><AlertNotifier/></Provider>
  //   )
  //   const output = renderer.getRenderOutput()
  //   output.should.equalJSX(
  //       <Container className='alert-container'>
  //         <Alert color="danger">
  //           { alert.message }
  //         </Alert>
  //       </Container>
  //   )
  // })

  it('should not display an alert', function(){
    const renderer = createRenderer()
    renderer.render(React.createElement(AlertComponent, {alert: {}}))
    const output = renderer.getRenderOutput()
    // console.dir(output)
    // output.should.equalJSX('')
    chai.expect(output).to.be.eql(null);
  })

  it('should display an alert', function(){
    const renderer = createRenderer()
    const alert = {message: 'lol'}
    renderer.render(React.createElement(AlertComponent, {alert: alert}))
    const output = renderer.getRenderOutput()
    // console.dir(output)
    output.should.equalJSX(
      <Container className='alert-container'>
        <Alert color="danger">
          { alert.message }
        </Alert>
      </Container>
    )
  })

})
