import * as R from 'ramda'
import { Tetri } from "../components/tetrimino/tetrimino"
import { getActiveTetrimino, getBoard } from "../middleware/boardManager"
import { verticallyMove, horizontallyMove, rotate, tetriShadow } from "../reducers/tetrimino"
import { updateBoardState, isValidBoard, bordersMask } from "../reducers/board"
import { checkLines } from './board';
import { getGameTetris, pullHeadTetri, pullAndAddTetri, overGame } from './game';
import { topLogicLinesCount } from '../components/board/board';

export const TETRIMINO_ADD = 'TETRIMINO_ADD'
export const TETRIMINO_SEAL = 'TETRIMINO_SEAL'
export const TETRIMINO_REMOVE = 'TETRIMINO_REMOVE'
export const TETRIMINO_MOVE_DOWN = 'TETRIMINO_MOVE_DOWN'
export const TETRIMINO_MOVE_FALL = 'TETRIMINO_MOVE_FALL'
export const TETRIMINO_MOVE_UP = 'TETRIMINO_MOVE_UP'
export const TETRIMINO_MOVE_LEFT = 'TETRIMINO_MOVE_LEFT'
export const TETRIMINO_MOVE_RIGHT = 'TETRIMINO_MOVE_RIGHT'
export const TETRIMINO_ROTATE = 'TETRIMINO_ROTATE'

export const addTetrimino = ({identifier, rotation}, id) => {
	return {
		type: TETRIMINO_ADD,
		formType: identifier,
		orientation: rotation,
		id: id,
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

export const moveFallTetrimino = (distance) => {
	return {
		type: TETRIMINO_MOVE_FALL,
		distance: distance,
	}
}

export const moveUpTetrimino = () => {
	return {
		type: TETRIMINO_MOVE_UP,
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
	return R.ifElse(R.curry(isValidTetriMove)(getState()), () => successAction && dispatch(successAction), () => failureAction && dispatch(failureAction))(move)
}

const attemptMoveTetrimino = (move, successAction, failureAction) => R.curry(checkBoardBeforeMove)(R.__, R.__, move, successAction, failureAction)

export const attemptMoveFallTetrimino = () => {
	return (dispatch, getState) => {
		const currentActiveTetrimino = getActiveTetrimino(getState())
		const shadow = tetriShadow(currentActiveTetrimino, getBoard(getState()))
		const distance = shadow.position.y - currentActiveTetrimino.position.y
		if (distance > 0)
			dispatch(moveFallTetrimino(distance))
		dispatch(sealAndRenew())
	}
}

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

const isTetriOverlappingTop = R.pipe(R.take(topLogicLinesCount), R.any(R.any(R.compose(R.gt(R.__, 0), R.length))))

export const sealAndRenew = () => {
	return (dispatch, getState) => {
		dispatch(sealTetrimino())
		dispatch(checkLines())
		if (isTetriOverlappingTop(getBoard(getState())))
			dispatch(overGame())
		else
			dispatch(pullAndAddTetri())
	}
}