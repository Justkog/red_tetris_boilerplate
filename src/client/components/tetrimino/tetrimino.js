import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'

const columnNumbers = R.range(0, 3)
const rowNumbers = R.range(0, 3)

const tetriForm = [
	[0, 1, 0],
	[0, 1, 0],
	[1, 1, 0],
]

const tetri = {
	form: tetriForm,
	color: 'var(--pink)',
}

const exist = (cellValue) => {
	return cellValue == 1 ? true : false
}

const defaultCellStyle = {
	flex: 1,
	textAlign: 'center',
	color: 'white',
	borderStyle: 'dashed',
	borderWidth: '4px',
	borderColor: 'transparent',
}

const cellStyle = (exist, color) => {
	if (!exist) {
		return defaultCellStyle
	}
	return R.merge(defaultCellStyle, {borderColor: 'white', backgroundColor: color})
}

const tetriCells = (values) => {
	const listCells = columnNumbers.map((number) => {
		return (
			<div key={number.toString()} style={cellStyle(exist(values[number]), tetri.color)}>
				
			</div>
		)
	})
	return listCells
}

const Grid = (props) => {
	const listRows = rowNumbers.map((number) =>
		<div key={number.toString()} style={{flex: 1, display: 'flex', flexDirection: 'row', height: '33.33%'}}>
			{tetriCells(tetriForm[number])}
		</div>
	)
	return (
		<div style={{ height: '100%'}}>
			{listRows}
		</div>
	)
}

const Tetrimino = (props) => {
	return (
		<div style={{
			width: 'calc(300% + 6 * 2px)',
			height: 'calc(300% + 6 * 2px)',
			top: 'calc(-100% - 3 * 2px)',
			left: 'calc(-100% - 3 * 2px)',
			position: 'absolute',
			zIndex: 100,
			transform: 'rotate(' + props.orientation + 'deg)',
		}}>
			<Grid/>
		</div>
	)
}

export default Tetrimino