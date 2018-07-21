import React from 'react'
import { connect } from 'react-redux'
import './board.css'
import { Alert, Container } from 'reactstrap'
import Tetrimino from "../tetrimino/tetrimino"
import * as R from 'ramda'

const columnNumbers = R.range(0, 10)
const rowNumbers = R.range(0, 20)

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

export const Board = ({activeTetrimino}) => {
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
		activeTetrimino: state.activeTetrimino
	}
}

export default connect(mapStateToProps, null)(Board)