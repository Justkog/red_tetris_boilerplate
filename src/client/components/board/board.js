import React from 'react';
import './board.css';
import { Alert, Container } from 'reactstrap';
import Tetrimino from "../tetrimino/tetrimino";
import * as R from 'ramda';
import { connect } from 'react-redux'

const columnNumbers = R.range(0, 10);
const rowNumbers = R.range(0, 20);

const Cell = (props) => {
	return (
		<div style={{flex: 1, textAlign: 'center', color: 'white', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'orange', position: 'relative'}}>
			{props.children}
		</div>
	);
}

const Row = (props) => {
	return (
		<div style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
			{props.children}
		</div>
	);
}

export const Board = ({activeTetrimino}) => {
	console.dir(activeTetrimino);
	const testListColumns = columnNumbers.map((number) =>
		<Cell key={number.toString()}>
			{ number == (activeTetrimino ? activeTetrimino.position.x : 0) && <Tetrimino/>}
		</Cell>
	);
	const listColumns = columnNumbers.map((number) =>
		<Cell key={number.toString()}>
		</Cell>
	);
	const listRows = rowNumbers.map((number) =>
		<Row key={number.toString()}>
			{ number == 3 ? testListColumns : listColumns}
		</Row>
	);
	return (
		<Container>
			<div className="board" style={{display: 'flex', flexDirection: 'column'}}>
				{listRows}
			</div>
		</Container>
	)
}

function mapStateToProps(state) {
	return { activeTetrimino: state.activeTetrimino }
}

export default connect(mapStateToProps)(Board)