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
import Rooms, { RoomsComponent } from "../../src/client/components/rooms/rooms";

chai.should()
chai.use(equalJSX)

describe('Rooms react test', function(){

    it('should forward to login', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}}}
        const wrapper = shallow(React.createElement(RoomsComponent, props));
        expect(!wrapper.contains('Rooms')).to.equal(true);
    })

    it('should display Rooms without rooms', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}}, rooms: [], userName: 'test'}
        const wrapper = shallow(React.createElement(RoomsComponent, props));
        expect(wrapper.contains('Rooms')).to.equal(true);
        expect(wrapper.find('Button.room-entry').exists()).to.equal(false);
    })

    it('should display Rooms with one room', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}}, rooms: ['test room'], userName: 'test'}
        const wrapper = shallow(React.createElement(RoomsComponent, props));
        expect(wrapper.contains('Rooms')).to.equal(true);
        expect(wrapper.find('Button.room-entry').exists()).to.equal(true);
    })

    it('should join Room', function(){
        configure({ adapter: new Adapter() })
        const onJoinRoom = sinon.spy()
        const props = {history: {push: (route) => {}}, rooms: ['test room'], userName: 'test', onJoinRoom: onJoinRoom}
        const wrapper = shallow(React.createElement(RoomsComponent, props));
        wrapper.find('Button.room-entry').simulate('click', {})
        expect(onJoinRoom.calledOnce).to.equal(true);
    })

    it('should join Room on enter key press', function(){
        configure({ adapter: new Adapter() })
        const onJoinRoom = sinon.spy()
        const props = {history: {push: (route) => {}}, rooms: ['test room'], userName: 'test', onJoinRoom: onJoinRoom, roomName: 'test room 2'}
        const wrapper = shallow(React.createElement(RoomsComponent, props));
        wrapper.find(Form).simulate('keyPress', {which: 13, preventDefault: () => {}})
        expect(onJoinRoom.calledOnce).to.equal(true);
    })

    it('should not join Room on random key press', function(){
        configure({ adapter: new Adapter() })
        const onJoinRoom = sinon.spy()
        const props = {history: {push: (route) => {}}, rooms: ['test room'], userName: 'test', onJoinRoom: onJoinRoom, roomName: 'test room 2'}
        const wrapper = shallow(React.createElement(RoomsComponent, props));
        wrapper.find(Form).simulate('keyPress', {which: 42, preventDefault: () => {}})
        expect(onJoinRoom.calledOnce).to.equal(false);
    })

    it('should not join Room on enter key press and empty room', function(){
        configure({ adapter: new Adapter() })
        const onJoinRoom = sinon.spy()
        const props = {history: {push: (route) => {}}, rooms: ['test room'], userName: 'test', onJoinRoom: onJoinRoom, roomName: undefined}
        const wrapper = shallow(React.createElement(RoomsComponent, props));
        wrapper.find(Form).simulate('keyPress', {which: 13, preventDefault: () => {}})
        expect(onJoinRoom.calledOnce).to.equal(false);
    })

    it('should set room name and join Room on enter key press', function(){
        configure({ adapter: new Adapter() })
        const onJoinRoom = sinon.spy()
        const expectedRoomName = 'test room 3'
        const props = {history: {push: (route) => {}}, rooms: ['test room'], userName: 'test', onJoinRoom: onJoinRoom, roomName: 'test room 2'}
        const wrapper = shallow(React.createElement(RoomsComponent, props));
        wrapper.find(Input).simulate('change', {target: {value: expectedRoomName}})
        wrapper.find(Form).simulate('keyPress', {which: 13, preventDefault: () => {}})
        expect(onJoinRoom.getCall(0).args[0]).to.equal(expectedRoomName);
    })

    it('should mapStateToProps and display Rooms', function(){
        configure({ adapter: new Adapter() })
        const onEmit = sinon.spy()
        const message = 'jc: lol'
        const initialState = {rooms: ['test room'], user: {login: 'jc'}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Rooms, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.contains('test room')).to.equal(true);
    })

    it('should mapDispatchToProps and call dispatch', function(){
        configure({ adapter: new Adapter() })
        const initialState = {rooms: ['test room'], user: {login: 'jc'}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const dispatchStub = sinon.stub(store, 'dispatch').callsFake(() => {});
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Rooms, {})}
                </MemoryRouter>
            </Provider>
        );
        wrapper.find('Button.room-entry').simulate('click', {})
        expect(dispatchStub.callCount).to.equal(1)
    })
})
