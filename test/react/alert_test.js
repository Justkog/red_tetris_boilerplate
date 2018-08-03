import chai from "chai"
import React from 'react'
import equalJSX from 'chai-equal-jsx'
import {createRenderer} from 'react-addons-test-utils'
import { AlertComponent } from "../../src/client/components/alert/alert";
import { Alert, Container } from 'reactstrap'

chai.should()
chai.use(equalJSX)

describe('AlertNotifier react test', function(){
  it('should not display an alert', function(){
    const renderer = createRenderer()
    renderer.render(React.createElement(AlertComponent, {alerts: []}))
    const output = renderer.getRenderOutput()
    // console.dir(output)
    // output.should.equalJSX('')
    chai.expect(output).to.be.eql(null);
  })

  it('should display an alert', function(){
    const renderer = createRenderer()
    const alert = {message: 'lol'}
    renderer.render(React.createElement(AlertComponent, {alerts: [alert]}))
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
