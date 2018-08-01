import { PLAYERS_MESSAGE } from '../../server/tools/constants';

export const sendMessage = (message, socket) => {
  socket.emit(PLAYERS_MESSAGE, { message: message })
}

export const chatUpdate = ({ message }) => ({
  type: PLAYERS_MESSAGE,
  message: message
})

export const registerChatUpdate = (socket, dispatch, getState) => {
  socket.off(PLAYERS_MESSAGE)
  socket.on(PLAYERS_MESSAGE, (data) => {
    console.log('Listening PLAYERS_MESSAGE: ', data);
    dispatch(chatUpdate(data))
  })
}
