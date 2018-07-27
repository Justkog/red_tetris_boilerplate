import * as constants from '../constants';
import { loginfo } from '../logs';

export function game_creation(socket, supervisor)
{
  socket.on(constants.GAME_CREATION, function (data) {
    loginfo(`Listening to ${constants.GAME_CREATION}: `, data);
    let player = supervisor.find_player(socket.id);

    if (!player.name && !supervisor.player_name_available(data.userName))
    {
      socket.emit(constants.PLAYER_ERROR, { message: 'name already taken' });
      return;
    }

    player.set_name(data.userName);

    if (!supervisor.game_name_available(data.roomName))
    {
      socket.emit(constants.GAME_ERROR, { message: 'name already taken' });
      return;
    }

    let game = supervisor.add_game(data.roomName, player, data.tetriNumber, false);
    socket.join(data.roomName);
    socket.emit(constants.ROOM_UPDATE, { roomName: game.room, users: game.playersNames() });
  });
}

export function game_creation_solo(socket, supervisor)
{
  socket.on(constants.GAME_CREATION_SOLO, function (data) {
    loginfo(`Listening to ${constants.GAME_CREATION_SOLO}: `, data);
    let player = supervisor.find_player(socket.id);

    if (data.userName && !player.name && !supervisor.player_name_available(data.userName)) {
      socket.emit(constants.PLAYER_ERROR, { message: 'name already taken' });
      return;
    }

    player.set_name(data.userName);

    const room = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let game = supervisor.add_game(room, player, data.tetriNumber, true);
    socket.join(room);
    socket.emit(constants.ROOM_UPDATE, { roomName: game.room, users: game.playersNames() });
  });
}

export function game_join(socket, supervisor)
{
  socket.on(constants.GAME_JOIN, function (data) {
    loginfo(`Listening to ${constants.GAME_JOIN}: `, data);
    let player = supervisor.find_player(socket.id);

    if (!player.name && !supervisor.player_name_available(data.userName))
    {
      socket.emit(constants.PLAYER_ERROR, { message: 'name already taken' });
      return ;
    }
    player.set_name(data.userName);
  
    let game = supervisor.find_game(data.roomName);
  
    if (!game)
    {
      if (!supervisor.game_name_available(data.roomName))
      {
        socket.emit(constants.GAME_ERROR, { message: 'name already taken' });
        return;
      }
      game = supervisor.add_game(data.roomName, player, data.tetriNumber, false);
    }

    if (!game.is_available())
    {
      socket.emit(constants.GAME_ERROR, { message: 'game already started' });
      return;
    }
  
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

export function player_end(socket, supervisor)
{
  socket.on(constants.PLAYER_END, function (data) {
    loginfo(`Listening to ${constants.PLAYER_END}: `, data);
    let player = supervisor.find_player(socket.id);
    let game = player.game;

    player.board = data.board;
    player.game_finished = true;

    const game_data = { users: game.playersInfos(), game_finished: game.all_players_finished() };
    const room = game.room;

    if (game_data['game_finished'])
      supervisor.remove_game(game);

    supervisor.send_data_to_room(room, constants.PLAYER_END, game_data)
  });
}