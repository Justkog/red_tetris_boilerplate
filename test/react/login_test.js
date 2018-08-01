import chai from "chai"
import React from 'react'
import equalJSX from 'chai-equal-jsx'
import {createRenderer} from 'react-addons-test-utils'
import { LoginComponent } from "../../src/client/components/login/login";
import { Container, Form, FormGroup, Label, Col, Input, Row, Button } from 'reactstrap'
import { Loader } from '../../src/client/components/loader/loader';
import { AlertNotifier } from '../../src/client/components/alert/alert';

chai.should()
chai.use(equalJSX)

describe('Login react test', function(){

    it('should display login page', function(){
        const renderer = createRenderer()
        const handleChange = () => {}
        const login = 'lol'
        const props = {history: {}, login: login, onSetLogin: handleChange}
        renderer.render(React.createElement(LoginComponent, props))
        const output = renderer.getRenderOutput()
        output.should.equalJSX(
            <Container>
                <Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
                    <h1>Red Tetris</h1>
                </Row>
                <Row className="justify-content-center">
                    <Form>
                        <FormGroup row>
                            <Label for="usernameInput" sm={4} size="lg">Your name</Label>
                            <Col sm={8}>
                                <Input value={login} onChange={handleChange} type="text" name="username" id="usernameInput" placeholder="player1" bsSize="lg" />
                            </Col>
                        </FormGroup>
                    </Form>
                </Row>
                <Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
                    <Button color="primary" size="lg" onClick={() => play(login)}>Play!</Button>{' '}
                </Row>
                <Loader/>
                <AlertNotifier/>
            </Container>
        )
      })

})
