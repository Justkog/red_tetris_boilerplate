import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Container } from 'reactstrap'

import { printableBoard, invertGrid, Cell, Row } from '../board/board'
import { bordersMask } from '../../reducers/board'
import '../board/board.css'


const LittleBoard = (board, name) => {

  const boardToDraw = printableBoard(board, invertGrid(bordersMask(board)))

  const listColumns = (row) => R.addIndex(R.map)((cell, index) =>
    <Cell key={index.toString() + name} value={cell}>
    </Cell>
  )(row)

  const listRows = boardToDraw.map((row, index) =>
    <Row key={index.toString() + name}>
      {listColumns(row)}
    </Row>
  )

  return (
    <Container className="litle-board-container">
      <div className="litle-board" style={{ display: 'flex', flexDirection: 'column' }}>
        {listRows}
      </div>
    </Container>
  )
}

const Spectre = ({ spectrum }) => {

  const keys = (!spectrum) ? [] : R.splitEvery(3, Object.keys(spectrum));

  const test = (k) => {
        return (k.map( (name) => {
          return (<div style={{ width: '20%', height: '20%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            {console.log('name: ', name)}
            <h1>{name}</h1>
            {LittleBoard(spectrum[name], name) }
          </div>)
        }
  ))};

  const all = keys.map((key) => {
    return (
   <div style={{ width: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
      { test(key) }
    </ div>
  )} );

  return (
    <div>
      { all }
    </div>
  )
}

const mapStateToProps = (state) => {

  return {
    spectrum: state.game.spectrum,
  }
}

export default connect(mapStateToProps, null)(Spectre)