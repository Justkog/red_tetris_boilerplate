import * as constants from './constants';
import { loginfo } from './logs';

export const initEngine = (io, supervisor) => {
  io.on('connection', function (socket) {
    loginfo("Socket connected: " + socket.id);

    supervisor.add_player(socket.id);
    socket.emit(constants.ROOMS_LIST_SHOW, { rooms: supervisor.list_availables_rooms() });

    socket.on(constants.GAME_CREATION, function (data) {
      loginfo(`Listening to ${constants.GAME_CREATION}: `, data);
      let player = supervisor.find_player(socket.id);
      player.set_name(data.userName);

      let game = supervisor.add_game(data.roomName, player, data.tetriNumber);
      socket.join(data.roomName);
      socket.emit(constants.ROOM_UPDATE, { roomName: game.room, users: game.playersNames() } );
    });

    socket.on(constants.GAME_JOIN, function (data) {
      loginfo(`Listening to ${constants.GAME_JOIN}: `, data);
      let player = supervisor.find_player(socket.id);
      player.set_name(data.userName);

      let game = supervisor.find_game(data.roomName);

      if (!game.is_available())
        return;

      socket.join(data.roomName);
      socket.emit(constants.ROOM_UPDATE, { roomName: game.room, users: game.playersNames() });
    });

    socket.on(constants.GAME_START, function (data) {
      loginfo(`Listening to ${constants.GAME_START}: `, data);
      let player = supervisor.find_player(socket.id);
      let game = player.game;

      if (!player.is_master)
        return ;

      game.is_running = true;
      const game_data = { boards: game.playersBoards(), tetris: game.allTetris() };
      supervisor.send_data_to_room(game.room, constants.GAME_START, game_data)
    });

    socket.on(constants.NEXT_TETRI, function (data) {
      loginfo(`Listening to ${constants.NEXT_TETRI}: `, data);
      let player = supervisor.find_player(socket.id);
      let game = player.game;

      player.update_piece_index();
      const index = player.piece_index * game.tetri_number;

      if (index >= game.pieces.length )
          game.addPieces();

      socket.emit(constants.NEXT_TETRI, { tetris: game.nextTetris(index) });
    });

    socket.on(constants.BOARD_UPDATE, function (data) {
      loginfo(`Listening to ${constants.BOARD_UPDATE}: `, data);
      let player = supervisor.find_player(socket.id);
      let game = player.game;

      player.board = data.board;

      game.playersWithoutOne(player).forEach((p) => {
        socket.broadcast.to(p.socket_id).emit(constants.SPECTRUM_UPDATE, { user: player.name, board: player.board });
      });
    });

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
        socket.broadcast.to(p.socket_id).emit(constants.INDESTRUCTIBLE_LINE_ADD, { linesNumber: data.linesNumber - 1 });
      });
    });

  })
}