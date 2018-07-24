import { Observable, Subject, ReplaySubject, from} from 'rxjs'
import { map, distinct } from 'rxjs/operators';
import * as R from 'ramda'
import { getBoard } from '../middleware/boardManager';
import { deleteLine } from './board';

export const LISTEN_BOARD_UPDATE = 'LISTEN_BOARD_UPDATE'

const getCompletedLines = (board) => {
	R.addIndex()
}

export const listenBoardUpdate = (store) => {
	return (dispatch, getState) => {
		const boardSubject = new Subject()
		const observable = from(store)
		observable.subscribe(boardSubject)
		boardSubject
		.pipe(map(state => (getBoard(state))), distinct())
		.subscribe(board => {
			const lines = getCompletedLines(board)
			if (lines.lenght > 0)
				dispatch(deleteLine(lines))
		})
	}
}
