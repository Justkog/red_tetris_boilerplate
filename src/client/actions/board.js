import { visualBoard, topLogicLinesCount } from "../components/board/board";
import { getBoard } from "../middleware/boardManager";
import * as R from 'ramda'

export const BOARD_UPDATE = 'BOARD_UPDATE'
export const LINES_DELETE = 'LINES_DELETE'

export const updateBoard = (prevActiveTetrimino, currentActiveTetrimino) => {
	return {
		type: BOARD_UPDATE,
		prevActiveTetrimino,
		currentActiveTetrimino
	}
}

export const deleteLines = (lines) => {
	return {
		type: LINES_DELETE,
		lines: lines,
	}
}

const isTetri = (cell) => {
	return R.gt(cell, 0)
}

const isComplete = (line) => {
	return R.all(isTetri)(line)
}

const getCompletedLines = (board) => {
	let lines = []
	R.addIndex(R.forEach)(R.__, board)((row, index) => {
		if (isComplete(row))
			lines = R.append(index + topLogicLinesCount)(lines)
	})
	return lines;
}

export const checkLines = () => {
	return (dispatch, getState) => {
		const lines = getCompletedLines(visualBoard(getBoard(getState())))
		if (lines.length > 0)
			dispatch(deleteLines(lines))
	}
}
