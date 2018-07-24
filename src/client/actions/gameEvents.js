import { Observable, Subject, ReplaySubject, from} from 'rxjs'
import { map, distinct } from 'rxjs/operators';
import * as R from 'ramda'
import { getBoard } from '../middleware/boardManager';
import { deleteLine } from './board';
import { visualBoard } from '../components/board/board';

export const LISTEN_BOARD_UPDATE = 'LISTEN_BOARD_UPDATE'

export const listenBoardUpdate = (store) => {
	return (dispatch, getState) => {
		// const boardSubject = new Subject()
		// const observable = from(store)
		// observable.subscribe(boardSubject)
		// boardSubject
		// .pipe(distinct((state) => state.activeTetrimino.id), map(state => visualBoard(getBoard(state))))
		// .subscribe(board => {
		// 	const lines = getCompletedLines(board)
		// 	console.dir(lines)
		// 	console.dir(board)
		// 	if (lines.lenght > 0)
		// 		dispatch(deleteLines(lines))
		// })
	}
}
