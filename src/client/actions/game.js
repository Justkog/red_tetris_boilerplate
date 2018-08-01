import * as R from 'ramda';
import { attemptMoveDownTetrimino, sealTetrimino, addTetrimino } from './tetrimino';
import { GAME_START, NEXT_TETRI_REQUEST, NEXT_TETRI, PLAYER_END, GAME_ERROR } from '../../server/tools/constants';
import { getSocket } from './socket';
import { listenToWindowEvent, keyDownDispatcher } from './key';
import { resetBoard } from './board';
import { getBoard, getActiveTetrimino } from '../middleware/boardManager';
import { removeTetriInState } from '../reducers/board';
import { visualBoard } from '../components/board/board';
import { from } from 'rxjs/internal/observable/from';
import { store } from '../index';
import { map } from 'rxjs/internal/operators/map';
import { filter } from 'rxjs/internal/operators/filter';
import { first } from 'rxjs/internal/operators/first';

export const GAME_PAUSE = 'GAME_PAUSE'
export const GAME_RESUME = 'GAME_RESUME'
export const GAME_INIT = 'GAME_INIT'
export const GAME_STOP = 'GAME_STOP'
export const GAME_RESET = 'GAME_RESET'
export const GAME_OVER = 'GAME_OVER'
export const GAME_WIN = 'GAME_WIN'
export const LOOP_UPDATE = 'LOOP_UPDATE'
export const TETRIS_UPDATE = 'TETRIS_UPDATE'
export const REGISTER_LOOP_INTERVAL_ID = 'REGISTER_LOOP_INTERVAL_ID'
export const GAME_START_REQUEST = 'GAME_START_REQUEST'
export const KEY_DOWN_UNSUBSCRIBE_REGISTER = 'KEY_DOWN_UNSUBSCRIBE_REGISTER'
export const HEAD_TETRI_REMOVE = 'HEAD_TETRI_REMOVE'
export const WAIT_GAME_END = 'WAIT_GAME_END'

const getLoopIntervalID = R.path(['game', 'loopIntervalID'])
const getKeydownUnsubscribe = R.path(['game', 'keydownUnsubscribe'])
const getGamePaused = R.path(['game', 'paused'])
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

export const togglePause = () => {
	return (dispatch, getState) => {
		const paused = getGamePaused(getState())
		if (paused) {
			const keyDownUnsubscribe = getKeydownUnsubscribe(getState())
			keyDownUnsubscribe()
			dispatch(resumeGame())
			dispatch(startGameLoop())
		}
		else {
			dispatch(pauseGame())
			dispatch(stopGameLoop())
			const unlistenkeyDown = dispatch(listenToWindowEvent('keydown', keyDownDispatcher, (e) => R.contains(e.key, ['p', 's'])))
			dispatch(registerKeyDownUnsubscriber(unlistenkeyDown))
		}
	}
}

export const permanentylPause = () => {
	return (dispatch, getState) => {
		const paused = getGamePaused(getState())
		if (!paused) {
			dispatch(pauseGame())
			dispatch(stopGameLoop())
		} else {
			const keyDownUnsubscribe = getKeydownUnsubscribe(getState())
			keyDownUnsubscribe()
		}
	}
}

export const startGame = () => ({
	type: GAME_START,
})

export const stopGame = () => ({
	type: GAME_STOP,
})

export const resetGame = () => ({
	type: GAME_RESET,
})

export const pauseGame = () => ({
	type: GAME_PAUSE,
})

export const resumeGame = () => ({
	type: GAME_RESUME,
})

export const overGame = () => ({
	type: GAME_OVER,
})

export const winGame = () => ({
	type: GAME_WIN,
})

export const receiveGameError = ({message}) => ({
	type: GAME_ERROR,
	message: message
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
		if (!newTetri)
			return
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
		dispatch(resetBoard())
		dispatch(sealTetrimino())
		dispatch(initGame(data))
		dispatch(pullAndAddTetri())
		dispatch(startGame())
		// const unlistenkeyDown = dispatch(listenToWindowEvent('keydown', keyDownDispatcher))
		// dispatch(registerKeyDownUnsubscriber(unlistenkeyDown))
	})
}

export const playerEnd = ({ users, game_finished }) => ({
	type: PLAYER_END,
	users: users,
	game_finished: game_finished,
})

export const registerPlayerEnd = (socket, dispatch, getState) => {
	console.log('registerPlayerEnd')
	socket.off(PLAYER_END)
	socket.on(PLAYER_END, (data) => {
		console.log('Listening PLAYER_END: ', data);
		dispatch(playerEnd(data))
		// if (getGame(getState()).waitingEnd && data.game_finished)
		// 	dispatch(stopGame())
	})
}

export const sendPlayerEnd = () => {
	return (dispatch, getState) => {
		let board = getBoard(getState())
		const activeTetri = getActiveTetrimino(getState())
		if (!R.isEmpty(activeTetri))
			board = removeTetriInState(board, activeTetri)
		const tetriFreeBoard = visualBoard(board)
		getSocket(getState()).emit(PLAYER_END, {board: tetriFreeBoard})
		console.log('player end sent')
	}
}

export const waitGameEnd = () => ({
	type: WAIT_GAME_END,
})

export const waitGameEndAsync = () => {
	return (dispatch, getState) => {
		console.log('waitGameEndAsync')
		dispatch(waitGameEnd())
		// wish I could put here a listener to game.finished and dispatch a stopGame once on true
		// looks like i did but bugs may occur
		const state$ = from(store);
		state$.pipe(
			map(state => state.game.finished),
			filter(v => v),
			first()
		).subscribe(() => {
			console.log('stopGame from waitGameEndAsync store observer')
			dispatch(stopGame())
			console.log('stopGame end from waitGameEndAsync store observer')
		})
	}
}

export const registerGameError = (socket, dispatch, getState) => {
	console.log('registerGameError')
	socket.off(GAME_ERROR)
	socket.on(GAME_ERROR, (data) => {
		console.log('Listening GAME_ERROR: ', data);
		dispatch(receiveGameError(data))
		console.dir(data)
	})
}