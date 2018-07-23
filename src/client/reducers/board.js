import { BOARD_UPDATE } from "../actions/board"
import * as R from 'ramda'
import { tetriTypeToFormFactory } from "../components/tetrimino/tetrimino"

const emptyRow = () => R.map((n) => 0, R.unfold((n) => n > 9 ? false : [n, n+1], 0))
const emptyBoard = () => R.map((n) => emptyRow(), R.unfold((n) => n > 19 ? false : [n, n+1], 0))

const emptyRowN = (columns) => R.map((n) => 0, R.unfold((n) => n > columns - 1 ? false : [n, n+1], 0))
const emptyBoardN = (rows, columns) => R.map((n) => emptyRowN(columns), R.unfold((n) => n > rows - 1 ? false : [n, n+1], 0))

const forEachIndexed = R.addIndex(R.forEach)

const isTetriOverlappingBorders = (board, invalidMask) => {
	return R.addIndex(R.any)((row, rowIndex) => {
		return R.addIndex(R.any)((cell, cellIndex) => {
			if (invalidMask[rowIndex][cellIndex] > 0 && cell > 0)
				return true
			return false
		})(row)
	})(board)
}

const isTetriOverlappingTetri = R.any(R.any(R.gt(R.__, 1)))

// check that there is nothing in left, right columns and bottom row
// check that there is no tetri overlap
export const isValidBoard = (board, invalidMask) => {
	if (isTetriOverlappingBorders(board, invalidMask))
		return false
	if (isTetriOverlappingTetri(board))
		return false
	return true
}

const populateSideBorders = R.map((row) =>
	R.compose(R.adjust((v) => 1, 0), R.adjust((v) => 1, row.length - 1))(row)
)

const populateBottomBorder = (board) => R.adjust((row) => R.map((v) => 1)(row), R.__)(R.length(board) - 1)(board)

const populateBorders = R.compose(
	populateSideBorders,
	populateBottomBorder
)

const emptyGrid = R.map((row) => 
	R.map((cell) => 0)(row)
)

export const bordersMask = R.compose(
	populateBorders,
	emptyGrid
) 

const updateCell = (op, tetriCell, position, stateCell) => {
	return op(stateCell)(tetriCell)
}

const updateRow = (cellUpdate, tetriRow, position, stateRow) => {
	forEachIndexed(R.__, tetriRow) ((cell, cellIndex) => {
		stateRow = R.adjust(cellUpdate(cell, position), position.x + cellIndex - 1, stateRow)
	})
	return stateRow
}

const rotate90 = R.compose(
	R.transpose,
	R.reverse,
)

const rotate180 = R.compose(
	R.reverse,
	R.map(R.reverse)
)

const rotate270 = R.compose(
	R.reverse,
	R.transpose,
)

const rotateFns = {
	0: R.identity,
	90: rotate90,
	180: rotate180,
	270: rotate270
}

const rotate = (orientation) => {
	return rotateFns[orientation]
}

const updateState = (rowUpdate, state, {position, orientation, formType}) => {
	const tetriForm = rotate(orientation)(tetriTypeToFormFactory(formType)())
	if (position.y < 0)
		return state
	forEachIndexed(R.__, tetriForm) ((row, rowIndex) => {
		state = R.adjust(rowUpdate(row, position), position.y + rowIndex - 1, state)
	})
	return state
}

const addTetriInCell = R.curry(updateCell)(R.add)
const removeTetriInCell = R.curry(updateCell)(R.subtract)

const addTetriInRow = R.curry(updateRow)(addTetriInCell)
const removeTetriInRow = R.curry(updateRow)(removeTetriInCell)

const addTetriInState = R.curry(updateState)(addTetriInRow)
const removeTetriInState = R.curry(updateState)(removeTetriInRow)

export const updateBoardState = (state, { prevActiveTetrimino, currentActiveTetrimino }) => {
	if (prevActiveTetrimino.id && prevActiveTetrimino.id == currentActiveTetrimino.id) {
		state = removeTetriInState(state, prevActiveTetrimino)
	}
	if (currentActiveTetrimino && !R.isEmpty(currentActiveTetrimino)) {
		state = addTetriInState(state, currentActiveTetrimino)
	}
	return state
}

export default (state = emptyBoardN(25, 12), action) => {
	switch (action.type) {
		case BOARD_UPDATE:
			if (!action.prevActiveTetrimino.formType && !action.currentActiveTetrimino.formType)
				return state
			return updateBoardState(state, action)
		default:
			return state
	}
}