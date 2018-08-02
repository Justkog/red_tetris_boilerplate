import chai, { expect } from "chai"
import React from 'react'
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
import { VictoryFrame, VictoryFrameComponent } from "../../src/client/components/victory_screen/victory_screen";

chai.should()
chai.use(equalJSX)

describe('VictoryFrame react test', function(){

    it('should display loss frame', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}}, victorious: true}
        const wrapper = shallow(React.createElement(VictoryFrameComponent, props));
        expect(wrapper.contains('You Win!')).to.equal(true);
    })

    it('should display nothing', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}}, victorious: false}
        const wrapper = shallow(React.createElement(VictoryFrameComponent, props));
        expect(wrapper.getElement()).to.equal(null);
    })

    it('should call onGameStop', function(){
        configure({ adapter: new Adapter() })
        const onGameStop = sinon.spy()
        const props = {history: {push: (route) => {}}, victorious: true, onGameStop: onGameStop}
        const wrapper = shallow(React.createElement(VictoryFrameComponent, props));
        wrapper.find('Button[children="Lobby"]').simulate('click', {})
        expect(onGameStop.calledOnce).to.equal(true)
    })

    it('should call onLeaveRoom', function(){
        configure({ adapter: new Adapter() })
        const onGameStop = sinon.spy()
        const onLeaveRoom = sinon.spy()
        const props = {history: {push: (route) => {}}, victorious: true, onLeaveRoom: onLeaveRoom, onGameStop: onGameStop}
        const wrapper = shallow(React.createElement(VictoryFrameComponent, props));
        wrapper.find('Button[children="Back to Rooms"]').simulate('click', {})
        expect(onLeaveRoom.calledOnce).to.equal(true)
    })

    it('should mapStateToProps and display loss frame', function(){
        configure({ adapter: new Adapter() })
        const initialState = { game: { victorious: true }, room: { solo: false }, room: {} }
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(VictoryFrame, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.contains('You Win!')).to.equal(true);
    })

    it('should mapDispatchToProps and call dispatch', function(){
        configure({ adapter: new Adapter() })
        const initialState = { game: { victorious: true }, room: { solo: false }, room: {} }
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const dispatchSpy = sinon.spy(store, 'dispatch')
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(VictoryFrame, {})}
                </MemoryRouter>
            </Provider>
        );
        wrapper.find('Button[children="Back to Rooms"]').simulate('click', {})
        wrapper.find('Button[children="Lobby"]').simulate('click', {})
        expect(dispatchSpy.calledThrice).to.equal(true)
    })

})
