import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Container } from 'reactstrap'

import { printableBoard, invertGrid, Cell, Row } from '../board/board'
import { bordersMask } from '../../reducers/board'
import '../board/board.css'

const boardToSpectre = (board) => {
  let previousRow = []
  board = R.map((row) => {
    if (R.isEmpty(previousRow))
      previousRow = row
    row = R.addIndex(R.map)((cell, index) => {
      if (!R.isEmpty(cell))
        return cell
      else
        return previousRow[index]
    })(row)
    previousRow = row
    return row
  })(board)
  return board
}

const LittleBoard = (board, name) => {

  const boardToDraw = boardToSpectre(board)

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
          return (<div style={{ height: '20%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            {console.log('name: ', name)}
            <h1>{name}</h1>
            {LittleBoard(spectrum[name], name) }
          </div>)
        }
  ))};

  const all = keys.map((key) => {
    return (
   <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
      { test(key) }
    </ div>
  )} );

  return (
    <div style={{ flexBasis: '33.33%' }}>
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