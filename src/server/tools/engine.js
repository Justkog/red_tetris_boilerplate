import { game_join, game_start, game_creation_solo, game_leave } from './engine/game';
import { player_end, player_ready } from './engine/player';
import { next_tetri } from './engine/tetri';
import { board_update, user_line_delete } from './engine/board';
import { login, logout } from './engine/connection';

export const initEngine = (io, supervisor) => {
  io.on('connection', function (socket) {
    login(socket, supervisor);
    logout(socket, supervisor);

    game_creation_solo(socket, supervisor);
    game_start(socket, supervisor);
    game_join(socket, supervisor);
    game_leave(socket, supervisor);

    next_tetri(socket, supervisor);

    board_update(socket, supervisor);
    user_line_delete(socket, supervisor);

    player_end(socket, supervisor);
    player_ready(socket, supervisor);
  })
}
