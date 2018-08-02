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
import { SoloEndFrame, SoloEndFrameComponent } from "../../src/client/components/solo_end/solo_end";

chai.should()
chai.use(equalJSX)

describe('SoloEndFrame react test', function(){

    it('should display SoloEndFrame', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}}, victorious: false, solo: true}
        const wrapper = shallow(React.createElement(SoloEndFrameComponent, props));
        expect(wrapper.contains('Game over')).to.equal(true);
    })

    it('should display nothing', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}}, solo: true}
        const wrapper = shallow(React.createElement(SoloEndFrameComponent, props));
        expect(wrapper.getElement()).to.equal(null);
    })

    it('should call onGameStop', function(){
        configure({ adapter: new Adapter() })
        const onGameStop = sinon.spy()
        const onStartGame = sinon.spy()
        const props = {history: {push: (route) => {}}, victorious: false, solo: true, onGameStop: onGameStop, onStartGame: onStartGame}
        const wrapper = shallow(React.createElement(SoloEndFrameComponent, props));
        wrapper.find('Button[children="Retry!"]').simulate('click', {})
        expect(onGameStop.calledOnce).to.equal(true)
    })

    it('should call onLeaveRoom', function(){
        configure({ adapter: new Adapter() })
        const onGameStop = sinon.spy()
        const onLeaveRoom = sinon.spy()
        const props = {history: {push: (route) => {}}, victorious: false, solo: true, onLeaveRoom: onLeaveRoom, onGameStop: onGameStop}
        const wrapper = shallow(React.createElement(SoloEndFrameComponent, props));
        wrapper.find('Button[children="Multiplayer!"]').simulate('click', {})
        expect(onLeaveRoom.calledOnce).to.equal(true)
    })

    it('should mapStateToProps and display SoloEndFrame', function(){
        configure({ adapter: new Adapter() })
        const initialState = { game: { victorious: false }, room: { solo: true } }
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(SoloEndFrame, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.contains('Game over')).to.equal(true);
    })

    it('should mapDispatchToProps and call dispatch', function(){
        configure({ adapter: new Adapter() })
        const initialState = { game: { victorious: false }, room: { solo: true } }
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const dispatchStub = sinon.stub(store, 'dispatch').callsFake(() => {});
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(SoloEndFrame, {})}
                </MemoryRouter>
            </Provider>
        );
        wrapper.find('Button[children="Multiplayer!"]').simulate('click', {})
        wrapper.find('Button[children="Retry!"]').simulate('click', {})
        expect(dispatchStub.callCount).to.equal(4)
    })
})
