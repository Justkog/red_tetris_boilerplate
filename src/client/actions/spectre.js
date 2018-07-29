import { SPECTRUM_UPDATE } from '../../server/tools/constants';

export const spectrumUpdate = ({ user, board }) => ({
  type: SPECTRUM_UPDATE,
  board: board,
  user: user,
})

export const registerSpectrumUpdate = (socket, dispatch, getState) => {
  socket.off(SPECTRUM_UPDATE)
  socket.on(SPECTRUM_UPDATE, (data) => {
    console.log('Listening SPECTRUM_UPDATE: ', data);
    dispatch(spectrumUpdate(data))
  })
}