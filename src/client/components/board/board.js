import React from 'react'
import { connect } from 'react-redux'
import './board.css'
import { Alert, Container } from 'reactstrap'
import * as R from 'ramda'
import { bordersMask } from '../../reducers/board'

export const topLogicLinesCount = 4

const columnNumbers = R.range(0, 10)
const rowNumbers = R.range(0, 20)

const invertGrid = R.map(R.map(R.ifElse(R.gte(R.__, 1), () => 0, () => 1)))

const removeExtraRows = R.compose(
	R.drop(topLogicLinesCount),
	R.dropLast(1)
)

export const visualBoard = (board) => printableBoard(board, invertGrid(bordersMask(board)))

const printableBoard = (board, printableMask) => {
	// console.log('printableMask')
	// console.dir(printableMask)
	const grid = R.addIndex(R.map)((row, rowIndex) => {
		return R.addIndex(R.filter)((cell, cellIndex) => {
			if (printableMask[rowIndex][cellIndex] > 0)
				return true
			else
				return false
		})(row)
	})(board)
	return removeExtraRows(grid)
}

const defaultCellStyle = {
	flex: 1,
	textAlign: 'center',
	color: 'white',
	borderStyle: 'dashed',
	borderWidth: '2px',
	borderColor: 'orange',
	position: 'relative',
}

const GenericCell = (cellStyle) => {
	return (
		<div style={cellStyle}>
		</div>
	)
}

const DefaultCell = () => GenericCell(defaultCellStyle)

const TetriCell = (color) => GenericCell(R.merge(defaultCellStyle, {borderColor: 'white', backgroundColor: color}))

const Cell = ({value}) => {
	if (R.length(value) > 0)
		return TetriCell(R.head(value).color)
	return DefaultCell()
}

const Row = (props) => {
	return (
		<div style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
			{props.children}
		</div>
	)
}

const Board = ({activeTetrimino, board}) => {

	const boardToDraw = printableBoard(board, invertGrid(bordersMask(board)))

	const listColumns = (row) => R.addIndex(R.map)((cell, index) =>
		<Cell key={index.toString()} value={cell}>
		</Cell>
	)(row)

	const listRows = boardToDraw.map((row, index) =>
		<Row key={index.toString()}>
			{listColumns(row)}
		</Row>
	)

	return (
		<Container className="board-container">
			<div className="board" style={{display: 'flex', flexDirection: 'column'}}>
				{listRows}
			</div>
		</Container>
	)
}

const mapStateToProps = (state) => {
	// console.dir('mapStateToProps')
	return {
		// activeTetrimino: state.activeTetrimino,
		board: state.board,
	}
}

export default connect(mapStateToProps, null)(Board)