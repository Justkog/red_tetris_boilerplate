import * as R from 'ramda'
import { moveLeftTetrimino, moveRightTetrimino, moveDownTetrimino, rotateTetrimino, attemptMoveDownTetrimino, attemptMoveRightTetrimino, attemptMoveLeftTetrimino, attemptRotateTetrimino, attemptMoveFallTetrimino } from './tetrimino';
import { addIndestructibleLines } from './board';
import { togglePause } from './game';

export const KEY_DOWN = 'KEY_DOWN';

export const keyDown = (e) => ({
	type: KEY_DOWN,
	key: e.key,
});

const allowedKeys = [
	'ArrowUp',
	'ArrowLeft',
	'ArrowRight',
	'ArrowDown',
	'p',
	'i',
	's',
	' ',
]

// thunk action creator, needs redux-thunk
export const listenToWindowEvent = (name, mapEventToAction, filter = (e) => R.contains(e.key, allowedKeys)) => {
	return function (dispatch) {
		function handleEvent(e) {
			if (filter(e)) {
				dispatch(mapEventToAction(e))
			}
		}
	
		window.addEventListener(name, handleEvent)
	
		// note: returns a function to unsubscribe
		return () => window.removeEventListener(name, handleEvent)
	}
}

export const keyDownDispatcher = (e) => {
	return (dispatch, getState) => {
		dispatch(keyDown(e))
		switch (e.key) {
			case 'ArrowLeft':
				return dispatch(attemptMoveLeftTetrimino())
			case 'ArrowRight':
				return dispatch(attemptMoveRightTetrimino())
			case 'ArrowDown':
				return dispatch(attemptMoveDownTetrimino())
			case 'ArrowUp':
				return dispatch(attemptRotateTetrimino())
			case ' ':
				return dispatch(attemptMoveFallTetrimino())
			case 'i':
				return dispatch(addIndestructibleLines({linesNumber: Math.floor(Math.random() * Math.floor(3)) + 1}))
			case 'p':
				return dispatch(togglePause())
			default:
				return
		}
	}
}