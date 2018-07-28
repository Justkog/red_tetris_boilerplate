import * as constants from '../constants';
import { loginfo } from '../logs';

export function next_tetri(socket, supervisor)
{
  socket.on(constants.NEXT_TETRI, function (data) {
    loginfo(`Listening to ${constants.NEXT_TETRI}: `);
    let player = supervisor.find_player(socket.id);
    let game = player.game;

    if (!game)
    {
      return ;
    }
    player.update_piece_index();
    const index = player.piece_index * game.tetri_number;

    if (index >= game.pieces.length)
      game.addPieces();

    socket.emit(constants.NEXT_TETRI, { tetris: game.nextTetris(index) });
  });
}
