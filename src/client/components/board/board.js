import React from 'react';
import './board.css';
import { Alert, Container } from 'reactstrap';
import Tetrimino from "../tetrimino/tetrimino";
import * as R from 'ramda';

const columnNumbers = R.range(0, 10);
const listColumns = columnNumbers.map((number) =>
	<div key={number.toString()} style={{flex: 1, textAlign: 'center', color: 'white', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'orange'}}></div>
);

const rowNumbers = R.range(0, 20);
const listRows = rowNumbers.map((number) =>
	<div key={number.toString()} style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
		{listColumns}
	</div>
);


export const Board = () => {
  return (
	<Container>
	    <div className="board" style={{display: 'flex', flexDirection: 'column'}}>
			{/* <Tetrimino/> */}
			{listRows}
		</div>
	</Container>
  )
}
