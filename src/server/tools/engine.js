import * as constants from './constants';
import { game_creation, game_join, game_start } from './engine/game';
import { next_tetri } from './engine/tetri';
import { board_update, user_line_delete } from './engine/board';
import { loginfo } from './logs';

export const initEngine = (io, supervisor) => {
  io.on('connection', function (socket) {
    loginfo("Socket connected: " + socket.id);

    supervisor.add_player(socket.id);
    socket.emit(constants.ROOMS_LIST_SHOW, { rooms: supervisor.list_availables_rooms() });

    game_creation(socket, supervisor);
    game_start(socket, supervisor);
    game_join(socket, supervisor);

    next_tetri(socket, supervisor);

    board_update(socket, supervisor);
    user_line_delete(socket, supervisor);

  })
}