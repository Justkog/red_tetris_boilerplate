import * as constants from '../constants';
import { loginfo } from '../logs';

export function player_end(socket, supervisor)
{
  socket.on(constants.PLAYER_END, function (data) {
    loginfo(`Listening to ${constants.PLAYER_END}: `);
    let player = supervisor.find_player(socket.id);
    let game = player.game;

    player.board = data.board;
    player.game_finished = true;

    const game_data = { users: game.playersInfos(), game_finished: game.all_players_finished() };
    const room = game.room;

    if (game_data['game_finished'])
      game.reset();

    supervisor.send_data_to_room(room, constants.PLAYER_END, game_data)
  });
}

export function player_ready(socket, supervisor)
{
  socket.on(constants.PLAYER_READY, function (data) {
    loginfo(`Listening to ${constants.PLAYER_READY}: `);
    let player = supervisor.find_player(socket.id);
    let game = player.game;

    if (!game)
    {
      socket.emit(constants.GAME_ERROR, { message: 'game not found' });
      return ;
    }

    player.is_ready = true;

    const game_data = { is_solo: game.is_solo, roomName: game.room, users: game.playersInfos() };

    supervisor.send_data_to_room(game.room, constants.ROOM_UPDATE, game_data)
  });
}