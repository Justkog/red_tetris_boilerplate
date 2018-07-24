import * as R from 'ramda'
import io from 'socket.io-client'
import { Observable, Subject, ReplaySubject, from} from 'rxjs'
import { test_socket_io } from '../components/test_socket_io';

export const SOCKET_CONNECT = 'SOCKET_CONNECT';
export const SOCKET_CONNECTED = 'SOCKET_CONNECTED';
export const SOCKET_DISCONNECTED = 'SOCKET_DISCONNECTED';
export const SOCKET_CONNECT_ERROR = 'SOCKET_CONNECT_ERROR';
export const SOCKET_CONNECT_TIMEOUT = 'SOCKET_CONNECT_TIMEOUT';
export const SOCKET_ERROR = 'SOCKET_ERROR';

export const getSocket = R.path(['socket'])

export const connectSocket = (socket) => ({
	type: SOCKET_CONNECT,
	socket: socket,
})

export const connectedSocket = () => ({
	type: SOCKET_CONNECTED,
})

export const connectErrorSocket = (error) => ({
	type: SOCKET_CONNECT_ERROR,
	error: error,
})

export const connectTimeoutSocket = (timeout) => ({
	type: SOCKET_CONNECT_TIMEOUT,
	timeout: timeout,
})

export const errorSocket = (error) => ({
	type: SOCKET_ERROR,
	error: error,
})

export const disconnectedSocket = (reason) => ({
	type: SOCKET_DISCONNECTED,
	reason: reason,
})

export const startSocket = () => {
	return (dispatch, getState) => {
		console.log('socket started')
		const socket = io(window.location.hostname + ':3004')
		socket.connect()
		const connectAction = connectSocket(socket)
		dispatch(connectAction)
		socket.on('connect', () => {
			dispatch(connectedSocket())
		})
		socket.on('connect_error', (error) => {
			dispatch(connectErrorSocket(error))
		});
		socket.on('connect_timeout', (timeout) => {
			dispatch(connectTimeoutSocket(timeout))
		});
		socket.on('error', (error) => {
			dispatch(errorSocket(error))
		});
		socket.on('disconnect', (reason) => {
			dispatch(disconnectedSocket(reason))
		})
	}
}

export const registerSocketEvent = (event) => {
	return (dispatch, getState) => {
		const socket = getSocket(getState())
		event(socket, dispatch, getState)
	}
}