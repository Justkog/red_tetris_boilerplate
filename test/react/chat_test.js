import chai, { expect } from "chai"
import React from 'react'
import * as R from 'ramda'
import equalJSX from 'chai-equal-jsx'
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
import Chat, { ChatComponent } from "../../src/client/components/chat/chat";

chai.should()
chai.use(equalJSX)

describe('Chat react test', function(){

    it('should display Chat without message', function(){
        configure({ adapter: new Adapter() })
        const props = {messages: []}
        const wrapper = shallow(React.createElement(ChatComponent, props));
        expect(wrapper.contains('Send!')).to.equal(true);
        expect(wrapper.contains('<h3>')).to.equal(false);
    })

    it('should display Chat with one message', function(){
        configure({ adapter: new Adapter() })
        const message = 'jc: lol'
        const props = {messages: [message]}
        const wrapper = shallow(React.createElement(ChatComponent, props));
        expect(wrapper.contains('Send!')).to.equal(true);
        expect(wrapper.contains(<h3>{message}</h3>)).to.equal(true);
    })

    it('should call socket.emit and document.getElementById', function(){
        configure({ adapter: new Adapter() })
        const onEmit = sinon.spy()
        const props = {messages: [], socket: {emit: onEmit}}
        const getElementByIdStub = sinon.stub(document, 'getElementById').callsFake(() => ({value: ''}));
        const wrapper = shallow(React.createElement(ChatComponent, props));
        wrapper.find('Button[children="Send!"]').simulate('click', {})
        expect(onEmit.calledOnce).to.equal(true)
        expect(getElementByIdStub.calledOnce).to.equal(true)
        getElementByIdStub.restore()
    })

    it('should change message', function(){
        configure({ adapter: new Adapter() })
        const onEmit = sinon.spy()
        const props = {messages: [], socket: {emit: onEmit}, message: ''}
        const getElementByIdStub = sinon.stub(document, 'getElementById').callsFake(() => ({value: ''}));
        const wrapper = shallow(React.createElement(ChatComponent, props));
        const expectedValue = 'lol'
        wrapper.find(Input).simulate('change', {target: {value: expectedValue}})
        wrapper.find('Button[children="Send!"]').simulate('click', {})
        expect(R.equals(onEmit.getCall(0).args[1], {message: expectedValue})).to.equal(true)
        getElementByIdStub.restore()
    })

    it('should send message from Form', function(){
        configure({ adapter: new Adapter() })
        const onEmit = sinon.spy()
        const expectedValue = 'lol'
        const props = {messages: [], socket: {emit: onEmit}, message: 'lol'}
        const getElementByIdStub = sinon.stub(document, 'getElementById').callsFake(() => ({value: ''}));
        const wrapper = shallow(React.createElement(ChatComponent, props));
        wrapper.find(Form).simulate('keyPress', {which: 13, preventDefault: () => {}})
        expect(R.equals(onEmit.getCall(0).args[1], {message: expectedValue})).to.equal(true)
        getElementByIdStub.restore()
    })

    it('should not send message from Form', function(){
        configure({ adapter: new Adapter() })
        const onEmit = sinon.spy()
        const expectedValue = 'lol'
        const props = {messages: [], socket: {emit: onEmit}, message: 'lol'}
        const getElementByIdStub = sinon.stub(document, 'getElementById').callsFake(() => ({value: ''}));
        const wrapper = shallow(React.createElement(ChatComponent, props));
        wrapper.find(Form).simulate('keyPress', {which: 42, preventDefault: () => {}})
        expect(onEmit.callCount).to.equal(0)
        getElementByIdStub.restore()
    })

    it('should not send message from Form because message undefined', function(){
        configure({ adapter: new Adapter() })
        const onEmit = sinon.spy()
        const expectedValue = 'lol'
        const props = {messages: [], socket: {emit: onEmit}, message: undefined}
        const getElementByIdStub = sinon.stub(document, 'getElementById').callsFake(() => ({value: ''}));
        const wrapper = shallow(React.createElement(ChatComponent, props));
        wrapper.find(Form).simulate('keyPress', {which: 13, preventDefault: () => {}})
        expect(onEmit.callCount).to.equal(0)
        getElementByIdStub.restore()
    })

    it('should mapStateToProps and display Chat', function(){
        configure({ adapter: new Adapter() })
        const onEmit = sinon.spy()
        const message = 'jc: lol'
        const initialState = {socket: {emit: onEmit}, room: {messages: [message]}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Chat, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.contains(<h3>{message}</h3>)).to.equal(true);
    })

    it('should mapStateToProps and display Chat without message', function(){
        configure({ adapter: new Adapter() })
        const onEmit = sinon.spy()
        const message = 'jc: lol'
        const initialState = {socket: {emit: onEmit}, room: {}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Chat, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(!wrapper.contains('<h3>')).to.equal(true);
    })
})
