import chai, { expect } from "chai"
import React from 'react'
import equalJSX from 'chai-equal-jsx'
import { Container, Form, FormGroup, Label, Col, Input, Row, Button } from 'reactstrap'
import { Loader, LoaderComponent } from '../../src/client/components/loader/loader';
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

describe('Loader react test', function(){

    it('should display Loader Connecting..', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}}, socketStatus: ''}
        const wrapper = shallow(React.createElement(LoaderComponent, props));
        expect(wrapper.contains('Connecting..')).to.equal(true);
    })

    it('should display nothing', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}}, socketStatus: 'connected'}
        const wrapper = shallow(React.createElement(LoaderComponent, props));
        expect(wrapper.getElement()).to.equal(null);
    })

    it('should display Loader Attempting to reconnect..', function(){
        configure({ adapter: new Adapter() })
        const onGameStop = sinon.spy()
        const onStartGame = sinon.spy()
        const props = {history: {push: (route) => {}}, socketStatus: 'disconnected'}
        const wrapper = shallow(React.createElement(LoaderComponent, props));
        expect(wrapper.contains('Attempting to reconnect..')).to.equal(true);
    })

    it('should mapStateToProps and display Loader', function(){
        configure({ adapter: new Adapter() })
        const initialState = { connection: { status: '' } }
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Loader, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.contains('Connecting..')).to.equal(true);
    })
})
