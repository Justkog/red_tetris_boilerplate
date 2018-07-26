import * as R from 'ramda'
import { moveDownTetrimino, attemptMoveDownTetrimino } from './tetrimino';
import { GAME_START } from '../../server/tools/constants';
import { getSocket } from './socket';

export const START_GAME = 'START_GAME'
export const GAME_INIT = 'GAME_INIT'
export const STOP_GAME = 'STOP_GAME'
export const LOOP_UPDATE = 'LOOP_UPDATE'
export const REGISTER_LOOP_INTERVAL_ID = 'REGISTER_LOOP_INTERVAL_ID'
export const GAME_START_REQUEST = 'GAME_START_REQUEST'

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

export const requestGameStart = () => ({
	type: GAME_START_REQUEST,
})

export const requestGameStartAsync = (roomName) => {
	return (dispatch, getState) => {
		getSocket(getState()).emit(GAME_START, {roomName: roomName})
		dispatch(requestGameStart())
	}
}

export const initGame = ({ boards, tetris}) => ({
	type: GAME_INIT,
	boards: boards,
	tetris: tetris,
})

export const registerGameStart = (socket, dispatch, getState) => {
	console.log('registerGameStart')
	socket.off(GAME_START)
	socket.on(GAME_START, (data) => {
		console.log('Listening GAME_START: ', data);
		dispatch(initGame(data))
		dispatch(startGame())
	})
}