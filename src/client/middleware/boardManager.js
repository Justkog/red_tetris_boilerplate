import * as R from 'ramda'
import { updateBoard } from '../actions/board';

export const getBoard = R.path(['board'])
export const getActiveTetrimino = R.path(['activeTetrimino'])

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
  