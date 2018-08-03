import chai, { expect } from "chai"
import React from 'react'
import equalJSX from 'chai-equal-jsx'

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { shallow, mount, render } from 'enzyme';
import { MemoryRouter } from 'react-router'

import {configureStore} from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import { Provider } from 'react-redux'
import InternalRouter, { InternalRouterComponent } from "../../src/client/containers/internalRouter";
import { GameScreen } from "../../src/client/components/game_screen/game_screen";
import Lobby from "../../src/client/components/lobby/lobby";
import { Home } from "../../src/client/components/home/home";

chai.should()
chai.use(equalJSX)

describe('InternalRouter react test', function(){

    it('should display GameScreen', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}, location: {hash: ''}}, game: {started: true}}
        const wrapper = shallow(React.createElement(InternalRouterComponent, props));
        expect(wrapper.contains(<GameScreen/>)).to.equal(true);
    })

    it('should display Lobby', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}, location: {hash: ''}}, game: {started: false}, room: {name: 'test room'}, login: 'jc'}
        const wrapper = shallow(React.createElement(InternalRouterComponent, props));
        expect(wrapper.contains(<Lobby/>)).to.equal(true);
    })

    it('should display redirect to rooms', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}, location: {hash: ''}}, game: {started: false}, room: {}, login: 'jc'}
        const wrapper = shallow(React.createElement(InternalRouterComponent, props));
        console.log(wrapper.name())
        expect(wrapper.name()).to.equal('Redirect');
        expect(wrapper.prop('to')).to.equal('/rooms');
    })

    it('should display home', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}, location: {hash: ''}}, game: {started: false}, room: {}}
        const wrapper = shallow(React.createElement(InternalRouterComponent, props));
        console.log(wrapper.name())
        expect(wrapper.contains(<Home/>)).to.equal(true);
    })


    it('should mapStateToProps and display GameScreen', function(){
        configure({ adapter: new Adapter() })
        const initialState = {room: {solo: true}, user: {login: 'jc'}, game: {}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(InternalRouter, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.contains(<GameScreen/>)).to.equal(true);
    })
})
