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
import Board, { BoardComponent, Row, Cell } from "../../src/client/components/board/board";
import { BoardN, updateBoardState } from "../../src/client/reducers/board";
import { Tetri } from "../../src/client/components/tetrimino/tetrimino";

chai.should()
chai.use(equalJSX)

describe('Board react test', function(){

    it('should display Board with 20 rows and 10 columns', function(){
        configure({ adapter: new Adapter() })
        const testBoard = BoardN(25, 12, [])
        const props = {board: testBoard}
        const wrapper = shallow(React.createElement(BoardComponent, props));
        expect(wrapper.find(Row)).to.have.length(20);
        expect(wrapper.find(Row).first().find(Cell)).to.have.length(10);
    })

    it('should display Board with tetri cells', function(){
        configure({ adapter: new Adapter() })
        const currentTetri = {
            position: {x: 5, y: 10},
            orientation: 0,
            formType: Tetri.Types.S,
            id: 1,
        }
        const testBoard = updateBoardState(BoardN(25, 12, []), {currentActiveTetrimino: currentTetri})

        const props = {board: testBoard}
        const wrapper = shallow(React.createElement(BoardComponent, props));
        expect(R.equals(
            wrapper.find(Row).at(6).find(Cell).at(4).props().value, 
            [ { destructible: true, id: 1, color: 'var(--teal)' } ]
        )).to.equal(true);
    })

    it('should display default Cell', function(){
        configure({ adapter: new Adapter() })
        const props = {value: []}
        const wrapper = shallow(React.createElement(Cell, props));
        expect(R.equals(
            wrapper.prop('style'), 
            {
                flex: 1,
                textAlign: 'center',
                color: 'white',
                borderStyle: 'dashed',
                borderWidth: '2px',
                borderColor: 'orange',
                position: 'relative',
            }
        )).to.equal(true);
    })

    it('should display tetri Cell', function(){
        configure({ adapter: new Adapter() })
        const props = {value: [ { destructible: true, id: 1, color: 'var(--teal)' } ]}
        const wrapper = shallow(React.createElement(Cell, props));
        expect(R.equals(
            wrapper.prop('style'), 
            {
                flex: 1,
                textAlign: 'center',
                color: 'white',
                borderStyle: 'dashed',
                borderWidth: '2px',
                borderColor: 'white',
                position: 'relative',
                backgroundColor: 'var(--teal)',
            }
        )).to.equal(true);
    })

    it('should mapStateToProps and display Board', function(){
        configure({ adapter: new Adapter() })
        const currentTetri = {
            position: {x: 5, y: 10},
            orientation: 0,
            formType: Tetri.Types.S,
            id: 1,
        }
        const testBoard = updateBoardState(BoardN(25, 12, []), {currentActiveTetrimino: currentTetri})
        const initialState = {board: testBoard}
        const store =  configureStore(rootReducer, null, initialState, {

        })
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    {React.createElement(Board, {})}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.find(Row)).to.have.length(20);
        expect(wrapper.find(Row).first().find(Cell)).to.have.length(10);
    })
})
