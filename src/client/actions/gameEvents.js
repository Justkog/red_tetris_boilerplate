import { Observable, Subject, ReplaySubject, from} from 'rxjs'
import { map } from 'rxjs/operators';

export const LISTEN_BOARD_UPDATE = 'LISTEN_BOARD_UPDATE'

export const listenBoardUpdate = (store) => {
	return (dispatch, getState) => {
		// const observalbe = Observable.
		// Observable.from()
		const observable = from(store)
		observable
		// .pipe(map(state => ({ fromRx: true, ...state })))
		.subscribe(state => console.dir(state))
		// const observable = Rx.Observable.from(store)
	}
}
