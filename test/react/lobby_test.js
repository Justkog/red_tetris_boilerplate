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
import Lobby, { LobbyComponent } from "../../src/client/components/lobby/lobby";

chai.should()
chai.use(equalJSX)

describe('Lobby react test', function(){

    it('should display Lobby without users', function(){
        configure({ adapter: new Adapter() })
        const props = {users: {}}
        const wrapper = shallow(React.createElement(LobbyComponent, props));
        expect(wrapper.contains('Players')).to.equal(true);
        expect(wrapper.find('Button.room-entry').exists()).to.equal(false);
    })

    it('should display Lobby with one user', function(){
        configure({ adapter: new Adapter() })
        const props = {users: {jc: {is_master: true}}, login: 'lambda'}
        const wrapper = shallow(React.createElement(LobbyComponent, props));
        expect(wrapper.contains('Players')).to.equal(true);
        wrapper.find('Button.room-entry').simulate('click', {})
        expect(wrapper.find('Button.room-entry').exists()).to.equal(true);
    })

    it('should display Lobby with one master user, Start enabled', function(){
        configure({ adapter: new Adapter() })
        const props = {users: {jc: {is_master: true, ready: true}}, login: 'jc'}
        const wrapper = shallow(React.createElement(LobbyComponent, props));
        expect(wrapper.contains('Players')).to.equal(true);
        expect(wrapper.find('Button.room-entry').exists()).to.equal(true);
        expect(wrapper.find('Button[children="Start"]').prop('disabled')).to.equal(false);
    })

    it('should start game', function(){
        configure({ adapter: new Adapter() })
        const onStartGame = sinon.spy()
        const props = {users: {jc: {is_master: true, ready: true}}, login: 'jc', onStartGame: onStartGame}
        const wrapper = shallow(React.createElement(LobbyComponent, props));
        wrapper.find('Button[children="Start"]').simulate('click', {})
        expect(onStartGame.calledOnce).to.equal(true);
    })

    it('should leave room', function(){
        configure({ adapter: new Adapter() })
        const onLeaveRoom = sinon.spy()
        const props = {history: {push: (route) => {}}, users: {jc: {is_master: true, ready: true}}, login: 'jc', onLeaveRoom: onLeaveRoom}
        const wrapper = shallow(React.createElement(LobbyComponent, props));
        wrapper.find('Button[children="< Back to Rooms"]').simulate('click', {})
        expect(onLeaveRoom.calledOnce).to.equal(true);
    })

    it('should mapStateToProps and display Lobby', function(){
        configure({ adapter: new Adapter() })
        const initialState = {room: {name: 'test room', users: {jc: {is_master: true, ready: true}}}, user: {login: 'jc'}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Lobby, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.contains('test room')).to.equal(true);
    })

    it('should mapStateToProps and display Lobby without users', function(){
        configure({ adapter: new Adapter() })
        const initialState = {room: {name: 'test room'}, user: {login: 'jc'}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Lobby, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.contains('test room')).to.equal(true);
    })

    it('should mapDispatchToProps and call dispatch', function(){
        configure({ adapter: new Adapter() })
        const initialState = {room: {name: 'test room', users: {jc: {is_master: true, ready: true}}}, user: {login: 'jc'}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const dispatchStub = sinon.stub(store, 'dispatch').callsFake(() => {});
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Lobby, {})}
                </MemoryRouter>
            </Provider>
        );
        wrapper.find('Button[children="Start"]').simulate('click', {})
        wrapper.find('Button[children="< Back to Rooms"]').simulate('click', {})
        expect(dispatchStub.callCount).to.equal(2)
    })
})
