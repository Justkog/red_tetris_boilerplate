import { getSocket } from "./socket";
import { ROOMS_LIST_SHOW } from "../../server/tools/constants";

export const registerRoomsListShow = (socket, dispatch, getState) => {
	console.log('registerRoomsListShow')
	socket.off(ROOMS_LIST_SHOW)
	socket.on(ROOMS_LIST_SHOW, (data) => {
		console.log('Listening ROOMS_LIST_SHOW: ', data);
		dispatch(showRoomsList(data.rooms))
		console.dir(data)
	})
}

export const showRoomsList = (rooms) => ({
	type: ROOMS_LIST_SHOW,
	rooms: rooms,
});