import { BOARD_UPDATE, LINES_DELETE, BOARD_RESET, addIndestructibleLines } from "../actions/board"
import * as R from 'ramda'
import { tetriTypeToFormFactory, tetriTypeToColorFactory } from "../components/tetrimino/tetrimino"
import { INDESTRUCTIBLE_LINES_ADD } from "../../server/tools/constants";

// const emptyRow = () => R.map((n) => 0, R.unfold((n) => n > 9 ? false : [n, n+1], 0))
// const emptyBoard = () => R.map((n) => emptyRow(), R.unfold((n) => n > 19 ? false : [n, n+1], 0))

const emptyCell = () => []
const indestructibleBlock = () => ({destructible: false, color: 'var(--gray)', id: -1})

export const RowN = (columns, cellContent) => R.map((n) => cellContent, R.unfold((n) => n > columns - 1 ? false : [n, n+1], 0))
export const BoardN = (rows, columns, cellContent) => R.map((n) => RowN(columns, cellContent), R.unfold((n) => n > rows - 1 ? false : [n, n+1], 0))

const forEachIndexed = R.addIndex(R.forEach)

const isTetriOverlappingBorders = (board, invalidMask) => {
	return R.addIndex(R.any)((row, rowIndex) => {
		return R.addIndex(R.any)((cell, cellIndex) => {
			if (invalidMask[rowIndex][cellIndex] > 0 && R.length(cell) > 0)
				return true
			return false
		})(row)
	})(board)
}

const isTetriOverlappingTetri = R.any(R.any(R.compose(R.gt(R.__, 1), R.length)))

// check that there is nothing in left, right columns and bottom row
// check that there is no tetri overlap
export const isValidBoard = (board, invalidMask) => {
	if (isTetriOverlappingBorders(board, invalidMask))
		return false
	if (isTetriOverlappingTetri(board))
		return false
	return true
}

const populateMaskSideBorders = R.map((row) =>
	R.compose(R.adjust((v) => 1, 0), R.adjust((v) => 1, row.length - 1))(row)
)

const populateMaskBottomBorder = (board) => R.adjust((row) => R.map((v) => 1)(row), R.__)(R.length(board) - 1)(board)

const populateBorders = R.compose(
	populateMaskSideBorders,
	populateMaskBottomBorder
)

const emptyGrid = R.map((row) =>
	R.map((cell) => 0)(row)
)

export const bordersMask = R.compose(
	populateBorders,
	emptyGrid
) 

const updateCell = (op, tetriCell, activeTetri, stateCell) => {
	return op(stateCell)(tetriCell, activeTetri)
}

const updateRow = (cellUpdate, tetriRow, activeTetri, stateRow) => {
	forEachIndexed(R.__, tetriRow) ((cell, cellIndex) => {
		stateRow = R.adjust(cellUpdate(cell, activeTetri), activeTetri.position.x + cellIndex - 1, stateRow)
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

const updateState = (rowUpdate, state, activeTetri) => {
	const tetriForm = rotate(activeTetri.orientation)(tetriTypeToFormFactory(activeTetri.formType)())
	if (activeTetri.position.y < 0)
		return state
	forEachIndexed(R.__, tetriForm) ((row, rowIndex) => {
		const stateRowIndex = activeTetri.position.y + rowIndex - 1
		if (stateRowIndex >= 0)
			state = R.adjust(rowUpdate(row, activeTetri), activeTetri.position.y + rowIndex - 1, state)
	})
	return state
}

const addTetriInCell = R.curry(updateCell)(
	R.curry(
		(stateCell, tetriCell, activeTetri) => {
			if (tetriCell > 0) {
				return R.append({destructible: true, id: activeTetri.id, color: tetriTypeToColorFactory(activeTetri.formType)()}, stateCell)
			}
			return stateCell
		}
	)
)

const removeTetriInCell = R.curry(updateCell)(
	R.curry(
		(stateCell, tetriCell, activeTetri) => {
			if (tetriCell > 0) {
				const index = R.findIndex(R.propEq('id', activeTetri.id))(stateCell)
				if (index >= 0)
					return R.remove(index, 1, stateCell)
			}
			return stateCell
		}
	)
)

const addTetriInRow = R.curry(updateRow)(addTetriInCell)
const removeTetriInRow = R.curry(updateRow)(removeTetriInCell)

const addTetriInState = R.curry(updateState)(addTetriInRow)
export const removeTetriInState = R.curry(updateState)(removeTetriInRow)

export const updateBoardState = (state, { prevActiveTetrimino, currentActiveTetrimino }) => {
	if (prevActiveTetrimino.id && prevActiveTetrimino.id == currentActiveTetrimino.id) {
		state = removeTetriInState(state, prevActiveTetrimino)
	}
	if (currentActiveTetrimino && !R.isEmpty(currentActiveTetrimino)) {
		state = addTetriInState(state, currentActiveTetrimino)
	}
	return state
}

const deleteBoardLinesState = (state, { lines }) => {
	R.forEach(R.__, lines) ((lineIndex) => {
		state = R.prepend(RowN(state[lineIndex].length, []), state)
		state = R.remove(lineIndex + 1, 1, state)
	})
	return state
}

const populateMaskedCells = (row, rowMask, content) => {
	return R.addIndex(R.map)((cell, index) => {
		if (rowMask[index] > 0) {
			return content
		}
		return cell
	})(row)
}

// add line at the bottom
// push up all other lines
const addIndestructibleLinesState = (board, {activeTetri, count}) => {
	if (activeTetri)
		board = removeTetriInState(board, activeTetri)
	while (count > 0) {
		const bordersMaskedRow = R.last(R.init(bordersMask(board)))
		const indestructibleRow = populateMaskedCells(RowN(R.length(R.last(R.init(board))), [indestructibleBlock()]), bordersMaskedRow, emptyCell())
		board = R.insert(R.length(board) - 1, indestructibleRow, board)
		board = R.tail(board)
		count--
	}
	board = addTetriInState(board, activeTetri)
	return board
}

export default (state = BoardN(25, 12, []), action) => {
	switch (action.type) {
		case BOARD_UPDATE:
			if (!action.prevActiveTetrimino.formType && !action.currentActiveTetrimino.formType)
				return state
			return updateBoardState(state, action)
		case LINES_DELETE:
			return deleteBoardLinesState(state, action)
		case BOARD_RESET:
			return BoardN(25, 12, [])
		case INDESTRUCTIBLE_LINES_ADD:
			return addIndestructibleLinesState(state, action)
		default:
			return state
	}
}