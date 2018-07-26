import * as constants from '../constants';
import { loginfo } from '../logs';

export function game_creation(socket, supervisor)
{
  socket.on(constants.GAME_CREATION, function (data) {
    loginfo(`Listening to ${constants.GAME_CREATION}: `, data);
    let player = supervisor.find_player(socket.id);
    player.set_name(data.userName);

    let game = supervisor.add_game(data.roomName, player, data.tetriNumber);
    socket.join(data.roomName);
    socket.emit(constants.ROOM_UPDATE, { roomName: game.room, users: game.playersNames() });
  });
}

export function game_join(socket, supervisor)
{
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
}


export function game_start(socket, supervisor)
{
  socket.on(constants.GAME_START, function (data) {
    loginfo(`Listening to ${constants.GAME_START}: `, data);
    let player = supervisor.find_player(socket.id);
    let game = player.game;
  
    if (!player.is_master)
      return;
  
    game.is_running = true;
    const game_data = { boards: game.playersBoards(), tetris: game.allTetris() };
    supervisor.send_data_to_room(game.room, constants.GAME_START, game_data)
  });
}