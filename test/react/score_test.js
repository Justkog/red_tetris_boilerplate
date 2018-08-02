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
import Score, { ScoreComponent } from "../../src/client/components/score/score";


chai.should()
chai.use(equalJSX)

describe('Score react test', function(){

    it('should display jc Score', function(){
        configure({ adapter: new Adapter() })
        const props = {history: {push: (route) => {}}, scores: {jc: 9001}}
        const wrapper = shallow(React.createElement(ScoreComponent, props));
        expect(wrapper.contains(<h3>jc</h3>)).to.equal(true);
    })

    it('should mapStateToProps and display Score', function(){
        configure({ adapter: new Adapter() })
        const initialState = {game: {scores: {jc: 9001}}, room: {solo: true}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Score, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.contains(<h3>Your score :</h3>)).to.equal(true);
    })

    it('should mapStateToProps and display Score without scores', function(){
        configure({ adapter: new Adapter() })
        const initialState = {game: {}, room: {solo: true}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Score, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.contains('<Row>')).to.equal(false);
    })
})
