import * as R from 'ramda'
import { updateBoard } from '../actions/board';
// import { startGameLoop, stopGameLoop, startGame, stopGame } from '../actions/game'
const getBoard = R.path(['board'])
const getActiveTetrimino = R.path(['activeTetrimino'])

export const boardManager = ({ getState, dispatch }) => {
	return (next) => (action) => {
		const prevActiveTetrimino = getActiveTetrimino(getState())
		// const prevBoardState = getBoard(getState())
		let returnValue = next(action)
		const currentActiveTetrimino = getActiveTetrimino(getState())
		// const currentBoardState = getBoard(getState())

		if (prevActiveTetrimino == currentActiveTetrimino)
			return returnValue

		// let's update this board
		dispatch(updateBoard(prevActiveTetrimino, currentActiveTetrimino))

		return returnValue
	}
}
  