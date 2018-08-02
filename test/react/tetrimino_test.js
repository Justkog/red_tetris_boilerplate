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
import { tetriTypeToFormFactory, Tetri, tetriTypeToColorFactory } from "../../src/client/components/tetrimino/tetrimino";
import * as R from 'ramda'

chai.should()

describe('Tetrimino test', function() {
    it('should return proper tetri form', function(){
        const TForm = tetriTypeToFormFactory(Tetri.Types.T)()
        const expectedForm = [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ]
        expect(R.equals(TForm, expectedForm)).to.equal(true);
    })

    it('should return proper tetri color', function(){
        const OColor = tetriTypeToColorFactory(Tetri.Types.O)()
        const expectedColor = 'var(--indigo)'
        expect(R.equals(OColor, expectedColor)).to.equal(true);
    })
})
