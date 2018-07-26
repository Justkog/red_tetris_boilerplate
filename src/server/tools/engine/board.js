import * as constants from '../constants';
import { loginfo } from '../logs';

export function board_update(socket, supervisor)
{
  socket.on(constants.BOARD_UPDATE, function (data) {
    loginfo(`Listening to ${constants.BOARD_UPDATE}: `, data);
    let player = supervisor.find_player(socket.id);
    let game = player.game;

    player.board = data.board;

    game.playersWithoutOne(player).forEach((p) => {
      socket.broadcast.to(p.socket_id).emit(constants.SPECTRUM_UPDATE, { user: player.name, board: player.board });
    });
  });
}

export function user_line_delete(socket, supervisor)
{
  socket.on(constants.USER_LINE_DELETE, function (data) {
    loginfo(`Listening to ${constants.USER_LINE_DELETE}: `, data);
    let player = supervisor.find_player(socket.id);
    let game = player.game;

    player.board = data.board;
    player.update_score(data.linesNumber);

    supervisor.send_data_to_room(game.room, constants.UPDATE_SCORE, { scores: game.playersScores() });

    if (game.players.length == 1 || data.linesNumber <= 1)
      return;

    game.playersWithoutOne(player).forEach(p => {
      socket.broadcast.to(p.socket_id).emit(constants.INDESTRUCTIBLE_LINES_ADD, { linesNumber: data.linesNumber - 1 });
    });
  });
}
