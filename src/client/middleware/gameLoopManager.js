import * as R from 'ramda'
import { startGameLoop, stopGameLoop, startGame, stopGame } from '../actions/game'
const getLoopIntervalID = R.path(['game', 'loopIntervalID'])
const getGameStarted = R.path(['game', 'started'])

export const gameLoopManager = ({ getState, dispatch }) => {
	return (next) => (action) => {
		const prevStartedState = getGameStarted(getState())
		let returnValue = next(action)
		const currentStartedState = getGameStarted(getState())
		if (prevStartedState != currentStartedState) {
			if (currentStartedState) {
				dispatch(startGame())
				dispatch(startGameLoop())
			}
			else {
				dispatch(stopGame())
				dispatch(stopGameLoop())
			}
		}
		return returnValue
	}
  }
  