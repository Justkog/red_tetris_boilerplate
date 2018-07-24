export const START_GAME = 'START_GAME'
export const STOP_GAME = 'STOP_GAME'
export const LOOP_UPDATE = 'LOOP_UPDATE'
export const REGISTER_LOOP_INTERVAL_ID = 'REGISTER_LOOP_INTERVAL_ID'
import * as R from 'ramda'
import { moveDownTetrimino, attemptMoveDownTetrimino } from './tetrimino';

const getLoopIntervalID = R.path(['game', 'loopIntervalID'])
const getGameStarted = R.path(['game', 'started'])

export const startGameLoop = () => {
	return (dispatch, getState) => {
		let intervalID = setInterval(() => {
			dispatch(loopUpdate())
		}, 500)
		dispatch(loopUpdate())
		dispatch(registerLoopIntervalID(intervalID))
	}
}

export const stopGameLoop = () => {
	return (dispatch, getState) => {
		const intervalID = getLoopIntervalID(getState())
		clearInterval(intervalID)
	}
}

export const startGame = () => ({
	type: START_GAME,
})

export const stopGame = () => ({
	type: STOP_GAME,
})

export const loopUpdate = () => {
	return (dispatch, getState) => {
		dispatch(attemptMoveDownTetrimino())
	}
}

export const registerLoopIntervalID = (ID) => ({
	type: REGISTER_LOOP_INTERVAL_ID,
	loopIntervalID: ID
})