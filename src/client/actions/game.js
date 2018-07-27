import * as R from 'ramda'
import { moveDownTetrimino, attemptMoveDownTetrimino, sealTetrimino, addTetrimino } from './tetrimino';
import { GAME_START, NEXT_TETRI_REQUEST, NEXT_TETRI } from '../../server/tools/constants';
import { getSocket } from './socket';
import { listenToWindowEvent, keyDownDispatcher } from './key';
import { resetBoard } from './board';

export const START_GAME = 'START_GAME'
export const GAME_INIT = 'GAME_INIT'
export const STOP_GAME = 'STOP_GAME'
export const LOOP_UPDATE = 'LOOP_UPDATE'
export const TETRIS_UPDATE = 'TETRIS_UPDATE'
export const REGISTER_LOOP_INTERVAL_ID = 'REGISTER_LOOP_INTERVAL_ID'
export const GAME_START_REQUEST = 'GAME_START_REQUEST'
export const KEY_DOWN_UNSUBSCRIBE_REGISTER = 'KEY_DOWN_UNSUBSCRIBE_REGISTER'
export const HEAD_TETRI_REMOVE = 'HEAD_TETRI_REMOVE'

const getLoopIntervalID = R.path(['game', 'loopIntervalID'])
const getKeydownUnsubscribe = R.path(['game', 'keydownUnsubscribe'])
const getGameStarted = R.path(['game', 'started'])
export const getGameTetris = R.path(['game', 'tetris'])
export const getGame = R.path(['game'])

export const startGameLoop = () => {
	return (dispatch, getState) => {
		let intervalID = setInterval(() => {
			dispatch(loopUpdate())
		}, 500)
		dispatch(loopUpdate())
		dispatch(registerLoopIntervalID(intervalID))
		const unlistenkeyDown = dispatch(listenToWindowEvent('keydown', keyDownDispatcher))
		dispatch(registerKeyDownUnsubscriber(unlistenkeyDown))
	}
}

export const stopGameLoop = () => {
	return (dispatch, getState) => {
		const intervalID = getLoopIntervalID(getState())
		clearInterval(intervalID)
		const keyDownUnsubscribe = getKeydownUnsubscribe(getState())
		keyDownUnsubscribe()
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

export const registerKeyDownUnsubscriber = (unsubscribe) => ({
	type: KEY_DOWN_UNSUBSCRIBE_REGISTER,
	unsubscribe: unsubscribe
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

const removeHeadTetri = () => ({
	type: HEAD_TETRI_REMOVE,
})

export const pullHeadTetri = () => {
	return (dispatch, getState) => {
		const headTetri = R.head(getGameTetris(getState()))
		dispatch(removeHeadTetri())
		if (R.length(getGameTetris(getState())) < 5)
			dispatch(requestNextTetrisAsync())
		return headTetri
	}
}

export const pullAndAddTetri = () => {
	return (dispatch, getState) => {
		const newTetri = dispatch(pullHeadTetri())
		const id = getGame(getState()).lastTetriID;
		dispatch(addTetrimino(newTetri, id))
	}
}

export const requestNextTetri = () => ({
	type: NEXT_TETRI_REQUEST,
})

export const tetrisUpdate = ({tetris}) => ({
	type: TETRIS_UPDATE,
	tetris: tetris,
})

export const requestNextTetrisAsync = (roomName) => {
	return (dispatch, getState) => {
		getSocket(getState()).emit(NEXT_TETRI, {})
		dispatch(requestNextTetri())
	}
}

export const registerNextTetri = (socket, dispatch, getState) => {
	console.log('registerNextTetri')
	socket.off(NEXT_TETRI)
	socket.on(NEXT_TETRI, (data) => {
		console.log('Listening NEXT_TETRI: ', data);
		dispatch(tetrisUpdate(data))
	})
}

export const registerGameStart = (socket, dispatch, getState) => {
	console.log('registerGameStart')
	socket.off(GAME_START)
	socket.on(GAME_START, (data) => {
		console.log('Listening GAME_START: ', data);
		dispatch(sealTetrimino())
		dispatch(resetBoard())
		dispatch(initGame(data))
		dispatch(pullAndAddTetri())
		dispatch(startGame())
		// const unlistenkeyDown = dispatch(listenToWindowEvent('keydown', keyDownDispatcher))
		// dispatch(registerKeyDownUnsubscriber(unlistenkeyDown))
	})
}