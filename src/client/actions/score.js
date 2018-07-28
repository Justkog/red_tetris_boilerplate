import { UPDATE_SCORE } from '../../server/tools/constants';

export const scoreUpdate = ({ scores }) => ({
  type: UPDATE_SCORE,
  scores: scores
})

export const registerScoreUpdate = (socket, dispatch, getState) => {
  socket.off(UPDATE_SCORE)
  socket.on(UPDATE_SCORE, (data) => {
    console.log('Listening UPDATE_SCORE: ', data);
    dispatch(scoreUpdate(data))
  })
}