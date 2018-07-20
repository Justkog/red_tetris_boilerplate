import { BOARD_UPDATE } from "../actions/board";
import * as R from 'ramda'
import { tetriTypeToFormFactory } from "../components/tetrimino/tetrimino";

const emptyRow = () => R.map((n) => 0, R.unfold((n) => n > 9 ? false : [n, n+1], 0))
const emptyBoard = () => R.map((n) => emptyRow(), R.unfold((n) => n > 19 ? false : [n, n+1], 0))

const removePrevTetri = (state, {position, formType}) => {
	const tetriForm = tetriTypeToFormFactory(formType)()
	const tetriRow = position.y
	if (tetriRow < 0)
		return state
	const updatedRow = R.adjust(R.add(-1), position.x, state[tetriRow])
	const updatedState = R.adjust(() => updatedRow, position.y, state)
	return updatedState
}

const addCurrentTetri = (state, {position, formType}) => {
	const tetriForm = tetriTypeToFormFactory(formType)()
	const tetriRow = position.y
	if (tetriRow < 0)
		return state
	const updatedRow = R.adjust(R.add(1), position.x, state[tetriRow])
	const updatedState = R.adjust(() => updatedRow, position.y, state)
	return updatedState
}

const updateBoardState = (state, { prevActiveTetrimino, currentActiveTetrimino }) => {
	if (prevActiveTetrimino.id == currentActiveTetrimino.id)
		state = removePrevTetri(state, prevActiveTetrimino)
	if (currentActiveTetrimino)
		state = addCurrentTetri(state, currentActiveTetrimino)
	return state
}

export default (state = emptyBoard(), action) => {
	switch (action.type) {
		case BOARD_UPDATE:
			if (!action.prevActiveTetrimino.formType && !action.currentActiveTetrimino.formType)
				return state
			return updateBoardState(state, action)
		default:
			return state
	}
}