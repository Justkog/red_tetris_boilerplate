import { getSocket } from "./socket";
import { GAME_JOIN, ROOM_UPDATE, ROOM_LEAVE, PLAYER_READY, GAME_CREATION_SOLO } from "../../server/tools/constants";
import { getUser } from "../reducers/user";
import { requestGameStartAsync } from "./game";
import * as R from 'ramda'

export const ROOM_JOIN = 'ROOM_JOIN'
export const SOLO_ROOM_JOIN = 'SOLO_ROOM_JOIN'

export const joinRoom = (name) => {
  return {
    type: ROOM_JOIN,
    name: name,
  }
}

export const joinSoloRoom = () => {
  return {
    type: SOLO_ROOM_JOIN,
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
    // console.log('updateRoom')
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

export const joinSoloRoomAsync = (name) => {
	return (dispatch, getState) => {
    getSocket(getState()).emit(GAME_CREATION_SOLO, {userName: getUser(getState()).login, tetriNumber: 10})
    dispatch(joinSoloRoom())
    // dispatch(readyPlayerAsync())
    dispatch(requestGameStartAsync())
	}
}

export const leaveRoomAsync = (name) => {
	return (dispatch, getState) => {
    const socket = getSocket(getState())
    console.log('socket status', getState().connection.status)
    if (getState().connection.status === 'connected') {
      console.log('ROOM_LEAVE sent')
      socket.emit(ROOM_LEAVE, {})
    }
		dispatch(leaveRoom())
	}
}

export const readyPlayerAsync = (name) => {
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
    if (getState().room.solo || R.contains(getState().user.login, R.keys(data.users)))
		  dispatch(updateRoom(data))
		console.dir(data)
	})
}