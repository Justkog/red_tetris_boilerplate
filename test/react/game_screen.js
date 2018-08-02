import chai, { expect } from "chai"
import React from 'react'
import equalJSX from 'chai-equal-jsx'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { shallow, mount, render } from 'enzyme';
import { GameScreen } from "../../src/client/components/game_screen/game_screen";
import Board from "../../src/client/components/board/board";

chai.should()
chai.use(equalJSX)

describe('GameScreen react test', function(){

    it('should display GameScreen', function(){
        configure({ adapter: new Adapter() })
        const props = {}
        const wrapper = shallow(React.createElement(GameScreen, props));
        expect(wrapper.contains(<Board />)).to.equal(true);
    })
})
