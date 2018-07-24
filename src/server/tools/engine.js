import * as constants from './constants';
import { loginfo } from './logs';

export const initEngine = (io, supervisor) => {
  io.on('connection', function (socket) {
    loginfo("Socket connected: " + socket.id);

    supervisor.add_player(socket.id);
    socket.emit(constants.ROOMS_LIST_SHOW, { rooms: supervisor.list_availables_rooms() });

    socket.on(constants.GAME_CREATION, function (data) {
      let player = supervisor.find_player(socket.id);
      player.set_name(data.userName);

      let game = supervisor.add_game(data.roomName, player, data.tetriNumber);
      socket.join(data.roomName);

      socket.emit(constants.ROOM_SHOW, { roomName: game.room, users: game.playersNames() } );
    });

    socket.on(constants.GAME_START, function (data) {
      let player = supervisor.find_player(socket.id);
      let game = player.game;

      game.is_running = true;
      const game_data = { boards: game.playersBoards(), tetris: game.allTetris() };
      supervisor.send_data_to_room(game.room, constants.GAME_START, game_data)
    });

    socket.on(constants.NEXT_TETRI, function () {
      let player = supervisor.find_player(socket.id);
      let game = player.game;

      player.update_piece_index();
      const index = player.piece_index * game.tetri_number;

      if (index >= game.pieces.length )
          game.addPieces();

      socket.emit(constants.NEXT_TETRI, { tetris: game.nextTetris(index) });
    });

  })
}