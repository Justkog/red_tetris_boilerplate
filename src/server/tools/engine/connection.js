import * as constants from '../constants';
import { loginfo } from '../logs';

export function login(socket, supervisor)
{
  loginfo("Socket connected: " + socket.id);

  supervisor.add_player(socket.id);
  socket.emit(constants.ROOMS_LIST_SHOW, { rooms: supervisor.list_availables_rooms() });
}

export function logout(socket, supervisor)
{
  socket.on('disconnect', function () {
    loginfo('User disconnected');
    let player = supervisor.find_player(socket.id);
    let game = player.game;

    if (game)
    {
      game.remove_player(player);
      loginfo('Player remove from game');
      if (game.players.length == 0)
      {
        supervisor.remove_game(game);
        loginfo('Game removed');
      }
    }
    supervisor.remove_player(player);
    loginfo('Player remove from all');
  });
}