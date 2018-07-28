import { visualBoard, topLogicLinesCount } from "../components/board/board";
import { getBoard, getActiveTetrimino } from "../middleware/boardManager";
import * as R from 'ramda'
import { INDESTRUCTIBLE_LINES_ADD, LINE_DELETE, USER_LINE_DELETE } from "../../server/tools/constants";
import { isValidBoard, bordersMask } from "../reducers/board";
import { moveUpTetrimino } from "./tetrimino";
import { tetriStartPosition } from "../reducers/tetrimino";
import { getSocket } from "./socket";

export const BOARD_UPDATE = 'BOARD_UPDATE'
export const BOARD_RESET = 'BOARD_RESET'
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

export const resetBoard = () => {
	return {
		type: BOARD_RESET,
	}
}

export const addIndestructibleLines = ({linesNumber}) => {
	return (dispatch, getState) => {
		dispatch({
			type: INDESTRUCTIBLE_LINES_ADD,
			count: linesNumber,
			activeTetri: getActiveTetrimino(getState())
		})
		while (!isValidBoard(getBoard(getState()), bordersMask(getBoard(getState()))) && getActiveTetrimino(getState()).position.y >= tetriStartPosition().y) {
			dispatch(moveUpTetrimino())
		}
	}
}

const isDestructibleBlock = R.propEq('destructible', true)

const containsDestructibleTetri = (cell) => {
	return R.and(R.all(isDestructibleBlock)(cell), R.compose(R.gt(R.__, 0), R.length)(cell))
}

const isComplete = (line) => {
	return R.all(containsDestructibleTetri)(line)
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
		if (lines.length > 0) {
			dispatch(deleteLines(lines))
			getSocket(getState()).emit(USER_LINE_DELETE, {linesNumber: lines.length, board: getBoard(getState())})
		}
	}
}

export const registerIndestructibleLinesAdd = (socket, dispatch, getState) => {
	console.log('registerIndestructibleLinesAdd')
	socket.off(INDESTRUCTIBLE_LINES_ADD)
	socket.on(INDESTRUCTIBLE_LINES_ADD, (data) => {
		console.log('Listening INDESTRUCTIBLE_LINES_ADD: ', data);
		dispatch(addIndestructibleLines(data))
	})
}