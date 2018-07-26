import { getSocket } from "./socket";

export const ROOM_JOIN = 'ROOM_JOIN'

export const joinRoom = (name) => {
  return {
    type: ROOM_JOIN,
    name: name,
  }
}

export const joinRoomAsync = (name) => {
	return (dispatch, getState) => {
        // getSocket(getState()).emit()
		dispatch(joinRoom(name))
	}
}
