import chai, { expect } from "chai"
import React from 'react'
import equalJSX from 'chai-equal-jsx'

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { shallow, mount, render } from 'enzyme';

import {configureStore} from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import { Provider } from 'react-redux'
import App, { AppComponent } from "../../src/client/containers/app";

chai.should()
chai.use(equalJSX)

describe('App react test', function(){
    it('should display App with 3 routes', function(){
        configure({ adapter: new Adapter() })
        const props = {}
        const wrapper = shallow(React.createElement(AppComponent, props));
        expect(wrapper.find('Route').length).to.equal(3);
    })

    it('should mapStateToProps and display App', function(){
        configure({ adapter: new Adapter() })
        const initialState = {alert: {message: 'unused'}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                {React.createElement(App, {})}
            </Provider>
        );
        console.log(wrapper.debug())
        expect(wrapper.find(AppComponent).length).to.equal(1);
        expect(wrapper.find(AppComponent).prop('message')).to.equal('unused');
    })
})
