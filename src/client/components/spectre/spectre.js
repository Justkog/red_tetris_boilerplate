import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Container } from 'reactstrap'

import { printableBoard, invertGrid, Cell, Row } from '../board/board'
import '../board/board.css'

export const boardToSpectre = (board) => {
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

export const LittleBoard = ({board, name}) => {

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

export const SpectreComponent = ({ spectrum }) => {

  const keys = (!spectrum) ? [] : R.splitEvery(3, Object.keys(spectrum));

  const test = (k) => {
      return (R.addIndex(R.map)((name, index) => {
        return (
          <div key={index.toString()} style={{ height: '20%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            {/* {console.log('name: ', name)} */}
            <h1>{name}</h1>
            {LittleBoard({board: spectrum[name], name: name}) }
          </div>
        )
      })(k))
  };

  const all = R.addIndex(R.map)((key, index) => {
    return (
      <div key={index.toString()} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        { test(key) }
      </ div>
    )} 
  )(keys);

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

export default connect(mapStateToProps, null)(SpectreComponent)