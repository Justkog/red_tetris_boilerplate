import * as R from 'ramda'
import { Tetri } from "../components/tetrimino/tetrimino";
import { getActiveTetrimino, getBoard } from "../middleware/boardManager";
import { verticallyMove, horizontallyMove, rotate } from "../reducers/tetrimino";
import { updateBoardState, isValidBoard, bordersMask } from "../reducers/board";

export const TETRIMINO_ADD = 'TETRIMINO_ADD'
export const TETRIMINO_SEAL = 'TETRIMINO_SEAL'
export const TETRIMINO_REMOVE = 'TETRIMINO_REMOVE'
export const TETRIMINO_MOVE_DOWN = 'TETRIMINO_MOVE_DOWN'
export const TETRIMINO_MOVE_LEFT = 'TETRIMINO_MOVE_LEFT'
export const TETRIMINO_MOVE_RIGHT = 'TETRIMINO_MOVE_RIGHT'
export const TETRIMINO_ROTATE = 'TETRIMINO_ROTATE'

export const addTetrimino = () => {
	return {
		type: TETRIMINO_ADD,
		formType: Tetri.Types.L,
	}
}

export const sealTetrimino = () => {
	return {
		type: TETRIMINO_SEAL,
	}
}

export const removeTetrimino = () => {
	return {
		type: TETRIMINO_REMOVE,
	}
}

export const moveDownTetrimino = () => {
	return {
		type: TETRIMINO_MOVE_DOWN,
	}
}

export const isValidTetriMove = (state, move) => {
	const currentTetriState = getActiveTetrimino(state)
	const nextTetriState = move(currentTetriState)
	const futureBoard = updateBoardState(getBoard(state), {prevActiveTetrimino: currentTetriState, currentActiveTetrimino: nextTetriState})
	return isValidBoard(futureBoard, bordersMask(futureBoard))
}

const tetriDownMove = R.curry(verticallyMove)(R.__, 1)
const tetriLeftMove = R.curry(horizontallyMove)(R.__, -1)
const tetriRightMove = R.curry(horizontallyMove)(R.__, 1)
const tetriRotate = R.curry(rotate)(R.__, 90)

const checkBoardBeforeMove = (dispatch, getState, move, successAction, failureAction) => {
	return R.ifElse(R.curry(isValidTetriMove)(getState()), () =>successAction && dispatch(successAction), () => failureAction && dispatch(failureAction))(move)
}

const attemptMoveTetrimino = (move, successAction, failureAction) => R.curry(checkBoardBeforeMove)(R.__, R.__, move, successAction, failureAction)

export const attemptMoveDownTetrimino = () => {
	return attemptMoveTetrimino(tetriDownMove, moveDownTetrimino(), sealAndRenew())
}

export const attemptMoveLeftTetrimino = () => {
	return attemptMoveTetrimino(tetriLeftMove, moveLeftTetrimino(), null)
}

export const attemptMoveRightTetrimino = () => {
	return attemptMoveTetrimino(tetriRightMove, moveRightTetrimino(), null)
}

export const attemptRotateTetrimino = () => {
	return attemptMoveTetrimino(tetriRotate, rotateTetrimino(), null)
}

export const moveLeftTetrimino = () => {
	return {
		type: TETRIMINO_MOVE_LEFT,
	}
}

export const moveRightTetrimino = () => {
	return {
		type: TETRIMINO_MOVE_RIGHT,
	}
}

export const rotateTetrimino = () => {
	return {
		type: TETRIMINO_ROTATE,
	}
}

export const sealAndRenew = () => {
	return (dispatch, getState) => {
		dispatch(sealTetrimino());
		dispatch(addTetrimino());
	}
}