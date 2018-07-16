import React from 'react';
import './board.css';
import { Alert, Container } from 'reactstrap';
import Tetrimino from "../tetrimino/tetrimino";
import * as R from 'ramda';

const columnNumbers = R.range(0, 10);
// const listColumns = columnNumbers.map((number) =>
// 	<div key={number.toString()} style={{flex: 1, textAlign: 'center', color: 'white', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'orange', position: 'relative'}}>
// 		{ number == 2 && <Tetrimino />}
// 	</div>
// );

const rowNumbers = R.range(0, 20);
// const listRows = rowNumbers.map((number) =>
// 	<div key={number.toString()} style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
// 		{listColumns}
// 	</div>
// );

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

export const Board = () => {
	const testListColumns = columnNumbers.map((number) =>
		<Cell key={number.toString()}>
			{ number == 2 && <Tetrimino/>}
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
