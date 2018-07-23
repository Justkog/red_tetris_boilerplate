import * as R from 'ramda'

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
	'p'
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