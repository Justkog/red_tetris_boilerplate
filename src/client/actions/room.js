import { getSocket } from "./socket";
import { GAME_JOIN, ROOM_UPDATE, ROOM_LEAVE, PLAYER_READY } from "../../server/tools/constants";
import { getUser } from "../reducers/user";

export const ROOM_JOIN = 'ROOM_JOIN'

export const joinRoom = (name) => {
  return {
    type: ROOM_JOIN,
    name: name,
  }
}

export const leaveRoom = () => {
  return {
    type: ROOM_LEAVE,
  }
}

export const readyPlayer = () => {
  return {
    type: PLAYER_READY,
  }
}

export const updateRoom = ({ roomName, users }) => {
    console.log('updateRoom')
    return {
      type: ROOM_UPDATE,
      roomName: roomName,
      users: users
    }
  }

export const joinRoomAsync = (name) => {
	return (dispatch, getState) => {
    getSocket(getState()).emit(GAME_JOIN, {userName: getUser(getState()).login, roomName: name, tetriNumber: 10})
		dispatch(joinRoom(name))
	}
}

export const leaveRoomAsync = (name) => {
	return (dispatch, getState) => {
    getSocket(getState()).emit(ROOM_LEAVE, {})
		dispatch(leaveRoom())
	}
}

export const playerReadyAsync = (name) => {
	return (dispatch, getState) => {
    getSocket(getState()).emit(PLAYER_READY, {})
		dispatch(readyPlayer())
	}
}

export const registerRoomUpdate = (socket, dispatch, getState) => {
	console.log('registerRoomUpdate')
	socket.off(ROOM_UPDATE)
	socket.on(ROOM_UPDATE, (data) => {
		console.log('Listening ROOM_UPDATE: ', data);
		dispatch(updateRoom(data))
		console.dir(data)
	})
}