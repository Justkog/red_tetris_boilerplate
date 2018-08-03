import chai, { expect } from "chai"
import * as R from 'ramda'
import React from 'react'
import equalJSX from 'chai-equal-jsx'
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
import { Tetri } from "../../src/client/components/tetrimino/tetrimino";
import Spectre, { SpectreComponent, LittleBoard, boardToSpectre } from "../../src/client/components/spectre/spectre";
import { BoardN, updateBoardState } from "../../src/client/reducers/board";
import { Row, Cell } from "../../src/client/components/board/board";

chai.should()
chai.use(equalJSX)

describe('Spectre react test', function(){

    it('should display LittleBoard with 20 rows and 10 columns', function(){
        configure({ adapter: new Adapter() })
        const testBoard = BoardN(20, 10, [])
        const props = {board: testBoard}
        const wrapper = shallow(React.createElement(LittleBoard, props));
        expect(wrapper.find(Row)).to.have.length(20);
        expect(wrapper.find(Row).first().find(Cell)).to.have.length(10);
    })

    it('should display Spectre with one spectrum', function(){
        configure({ adapter: new Adapter() })
        const currentTetri = {
            position: {x: 5, y: 10},
            orientation: 0,
            formType: Tetri.Types.S,
            id: 1,
        }
        const testSpectre = updateBoardState(BoardN(25, 12, []), {currentActiveTetrimino: currentTetri})

        const props = {spectrum: {jc: testSpectre}}
        const wrapper = shallow(React.createElement(SpectreComponent, props));
        console.log(wrapper.debug())
        expect(wrapper.contains(<h1>jc</h1>)).to.equal(true);
        expect(wrapper.find('div.litle-board').exists()).to.equal(true);
    })

    it('should mapStateToProps and display Spectre with jc spectrum', function(){
        configure({ adapter: new Adapter() })
        const currentTetri = {
            position: {x: 5, y: 10},
            orientation: 0,
            formType: Tetri.Types.S,
            id: 1,
        }
        const testSpectre = updateBoardState(BoardN(25, 12, []), {currentActiveTetrimino: currentTetri})
        const initialState = {game: {spectrum: {jc: testSpectre}}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Spectre, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.contains(<h1>jc</h1>)).to.equal(true);
        expect(wrapper.find('div.litle-board').exists()).to.equal(true);
    })

    it('should mapStateToProps and display Spectre without spectrum', function(){
        configure({ adapter: new Adapter() })
        const initialState = {game: {}}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Spectre, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.find('div.litle-board').exists()).to.equal(false);
    })
})
