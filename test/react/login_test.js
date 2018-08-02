import chai, { expect } from "chai"
import React from 'react'
import equalJSX from 'chai-equal-jsx'
import { createRenderer, findRenderedComponentWithType, scryRenderedComponentsWithType, renderIntoDocument } from 'react-addons-test-utils'
import { LoginComponent } from "../../src/client/components/login/login";
import { Container, Form, FormGroup, Label, Col, Input, Row, Button } from 'reactstrap'
import { Loader } from '../../src/client/components/loader/loader';
import { AlertNotifier } from '../../src/client/components/alert/alert';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router'

import {configureStore} from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import { Provider } from 'react-redux'

chai.should()
chai.use(equalJSX)

describe('Login react test', function(){

    it('should display login page', function(){
        const renderer = createRenderer()
        const handleChange = () => {}
        const onKeyPress = () => {}
        const login = 'lol'
        const props = {history: {}, login: login, onSetLogin: handleChange}
        const comp = React.createElement(LoginComponent, props)
        renderer.render(comp)
        const output = renderer.getRenderOutput()
        output.should.equalJSX(
            <Container>
                <Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
                    <h1>Red Tetris</h1>
                </Row>
                <Row className="justify-content-center">
                    <Form onKeyPress={onKeyPress}>
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

    it('should call onSetLogin twice', function(){
        configure({ adapter: new Adapter() })
        const initialState = {}
        const store =  configureStore(rootReducer, null, initialState, {

        })

        const onSetLogin = sinon.spy()
        const onKeyPress = () => {}
        const login = 'lol'
        const props = {history: {push: (route) => {}}, login: login, onSetLogin: onSetLogin}

        const wrapper = shallow(React.createElement(LoginComponent, props));
        // const wrapper = mount(React.createElement(LoginComponent, props));

        // const wrapper = shallow(<LoginComponent login={login} history={history} onSetLogin={onSetLogin} />)
        // const wrapper = mount(<Provider store={store}><MemoryRouter><LoginComponent login={login} history={history} onSetLogin={onSetLogin} /></MemoryRouter></Provider>)
        // console.dir(wrapper)
        // console.dir(wrapper.instance())
        // const onChangeSpy = sinon.spy(wrapper.find(Input), "onChange")
        // console.log(wrapper.debug())
        const event = {target: {value: 'lol2'}};
        const enterKeyEvent = {which: 13, preventDefault: () => {}};
        const lambdaKeyEvent = {which: 14, preventDefault: () => {}};
        wrapper.find(Input).simulate('change', event)
        wrapper.find(Form).simulate('keyPress', enterKeyEvent)
        wrapper.find(Form).simulate('keyPress', lambdaKeyEvent)
        wrapper.setProps({ login: undefined });
        wrapper.find(Form).simulate('keyPress', enterKeyEvent)
        // wrapper.find(Input).props().onChange(event)
        // console.dir(wrapper.find(LoginComponent).props())
        // console.dir(wrapper.instance().props)
        // console.log(wrapper.debug())
        // console.dir(wrapper.instance().props.login)
        // expect(wrapper.prop('login')).to.equal('lol2');
        expect(onSetLogin.calledTwice).to.equal(true)
    })

})
