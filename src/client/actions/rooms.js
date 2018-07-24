import { getSocket } from "./socket";

export const registerRoomsListShow = () => {
	return (dispatch, getState) => {
		const socket = getSocket(getState())
		console.log('registerRoomsListShow')
		socket.on('ROOMS_LIST_SHOW', (data) => {
			// dispatch(showRoomsList(data.))
			console.dir(data)
		})
	}
}

export const ROOMS_LIST_SHOW = 'ROOMS_LIST_SHOW';
export const showRoomsList = (rooms) => ({
	type: ROOMS_LIST_SHOW,
	rooms: rooms,
});