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
import { Home, HomeComponent } from "../../src/client/components/home/home";

chai.should()
chai.use(equalJSX)

describe('Home react test', function(){

    it('should display Home', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}}}
        const wrapper = shallow(React.createElement(HomeComponent, props));
        expect(wrapper.contains(<h1>Red Tetris</h1>)).to.equal(true);
    })

    it('should call onGameStop', function(){
        configure({ adapter: new Adapter() })
        const onJoinSolo = sinon.spy()
        const props = {history: {push: (route) => {}}, onJoinSolo: onJoinSolo}
        const wrapper = shallow(React.createElement(HomeComponent, props));
        wrapper.find('Button[children="Play solo!"]').simulate('click', {})
        expect(onJoinSolo.calledOnce).to.equal(true)
    })

    it('should call history.push', function(){
        configure({ adapter: new Adapter() })
        const onPush = sinon.spy()
        const props = {history: {push: onPush}}
        const wrapper = shallow(React.createElement(HomeComponent, props));
        wrapper.find('Button[children="Multiplayer!"]').simulate('click', {})
        expect(onPush.calledOnce).to.equal(true)
    })

    it('should mapStateToProps and display Home', function(){
        configure({ adapter: new Adapter() })
        const initialState = {connection: {status: 'connected'}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Home, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.contains(<h1>Red Tetris</h1>)).to.equal(true);
    })

    it('should mapDispatchToProps and call dispatch', function(){
        configure({ adapter: new Adapter() })
        const initialState = {connection: {status: 'connected'}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const dispatchStub = sinon.stub(store, 'dispatch').callsFake(() => {});
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Home, {})}
                </MemoryRouter>
            </Provider>
        );
        wrapper.find('Button[children="Play solo!"]').simulate('click', {})
        expect(dispatchStub.callCount).to.equal(1)
    })
})
