import * as R from 'ramda'
import { moveLeftTetrimino, moveRightTetrimino, moveDownTetrimino, rotateTetrimino, attemptMoveDownTetrimino, attemptMoveRightTetrimino, attemptMoveLeftTetrimino, attemptRotateTetrimino, attemptMoveFallTetrimino } from './tetrimino';
import { addIndestructibleLines } from './board';
import { togglePause } from './game';
import { fromEvent, interval, merge } from 'rxjs';
import { throttle, filter } from 'rxjs/operators';

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

const throttledKeys = [
	'p',
	' ',
	's',
]

// thunk action creator, needs redux-thunk
export const listenToWindowEvent = (name, mapEventToAction, keysFilter = (e) => R.contains(e.key, allowedKeys)) => {
	return function (dispatch) {
		function handleEvent(e) {
			if (keysFilter(e)) {
				dispatch(mapEventToAction(e))
			}
		}
	
		const source$ = fromEvent(window, name).pipe(filter((e) => !R.contains(e.key, throttledKeys)))
		const throttledSource$ = fromEvent(window, name).pipe(
			filter((e) => R.contains(e.key, throttledKeys)),
			throttle(val => interval(200)),
		)
		const subscription = merge(source$, throttledSource$).subscribe(handleEvent)

		// note: returns a function to unsubscribe
		return () => subscription.unsubscribe()
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