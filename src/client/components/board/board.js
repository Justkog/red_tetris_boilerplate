import React from 'react'
import { connect } from 'react-redux'
import './board.css'
import { Alert, Container } from 'reactstrap'
import Tetrimino from "../tetrimino/tetrimino"
import * as R from 'ramda'
import { bordersMask } from '../../reducers/board';

const columnNumbers = R.range(0, 10)
const rowNumbers = R.range(0, 20)

const invertGrid = R.map(R.map(R.ifElse(R.gte(R.__,1), () => 0, () => 1)))

const printableBoard = (board, printableMask) => {
	// console.dir(printableMask)
}

const Cell = (props) => {
	return (
		<div style={{flex: 1, textAlign: 'center', color: 'white', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'orange', position: 'relative'}}>
			{props.children}
		</div>
	)
}

const Row = (props) => {
	return (
		<div style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
			{props.children}
		</div>
	)
}

export const Board = ({activeTetrimino, board}) => {
	// console.dir(printableBoard(board, invertGrid(bordersMask(board))))
	const testListColumns = columnNumbers.map((number) =>
		<Cell key={number.toString()}>
			{ number == R.pathOr(0, ['position', 'x'], activeTetrimino) - 1 && <Tetrimino orientation={ R.prop('orientation', activeTetrimino) }/> }
		</Cell>
	)
	const listColumns = columnNumbers.map((number) =>
		<Cell key={number.toString()}>
		</Cell>
	)
	const listRows = rowNumbers.map((number) =>
		<Row key={number.toString()}>
			{ number == R.pathOr(0, ['position', 'y'], activeTetrimino) - 4 ? testListColumns : listColumns}
		</Row>
	)
	return (
		<Container>
			<div className="board" style={{display: 'flex', flexDirection: 'column'}}>
				{listRows}
			</div>
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		activeTetrimino: state.activeTetrimino,
		board: state.board,
	}
}

export default connect(mapStateToProps, null)(Board)