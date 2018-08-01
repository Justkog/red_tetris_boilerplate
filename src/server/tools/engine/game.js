import * as constants from '../constants';
import { loginfo } from '../logs';

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

    if (player.game)
    {
      let old_game = player.game;
      old_game.remove_player(player);
      if (old_game.players.length == 0)
        supervisor.remove_game(old_game);
    }

    const room = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    let game = supervisor.add_game(room, player, data.tetriNumber, true);

    socket.join(room);
    socket.emit(constants.ROOM_UPDATE, { is_solo: game.is_solo, roomName: game.room, users: game.playersInfos() });
  });
}

function remove_player_from_old_game(player, supervisor)
{
  let old_game = player.game;
  old_game.remove_player(player);
  if (old_game.players.length == 0)
    supervisor.remove_game(old_game);
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

    if (game && !game.is_available())
    {
      socket.emit(constants.GAME_ERROR, { message: 'game already started' });
      return;
    }

    if (!game)
    {
      if (player.game)
        remove_player_from_old_game(player, supervisor);
      game = supervisor.add_game(data.roomName, player, data.tetriNumber, false);
      supervisor.io.emit(constants.ROOMS_LIST_SHOW, { rooms: supervisor.list_availables_rooms() });
    }
    else if (!player.game)
      game.addPlayer(player);
    else if (player.game.room != game.room)
    {
      remove_player_from_old_game(player, supervisor);
      game.addPlayer(player);
    }

    socket.join(data.roomName);
    supervisor.send_data_to_room(game.room, constants.ROOM_UPDATE, { is_solo: game.is_solo, roomName: game.room, users: game.playersInfos() })
  });
}

function game_start_errors(socket, game, player)
{
  if (!game.is_solo && !game.is_available())
  {
    socket.emit(constants.GAME_ERROR, { message: 'game already started' });
    return true;
  }
  if (!game.is_game_ready())
  {
    socket.emit(constants.GAME_ERROR, { message: 'waiting for players' });
    return true;
  }
  if (!player.is_master)
  {
    socket.emit(constants.PLAYER_ERROR, { message: 'player is not master' });
    return true;
  }
  return false;
}

export function game_start(socket, supervisor)
{
  socket.on(constants.GAME_START, function (data) {
    loginfo(`Listening to ${constants.GAME_START}: `, data);
    let player = supervisor.find_player(socket.id);
    let game = player.game;
  
    if (game_start_errors(socket, game, player))
      return ;

    supervisor.send_data_to_room(game.room, constants.UPDATE_SCORE, { scores: game.playersScores() });
    game.is_running = true;
    const game_data = { boards: game.playersBoards(), tetris: game.allTetris() };
    supervisor.send_data_to_room(game.room, constants.GAME_START, game_data)
  });
}

export function game_leave(socket, supervisor)
{
  socket.on(constants.ROOM_LEAVE, function (data) {
    loginfo(`Listening to ${constants.ROOM_LEAVE}: `, data);
    let player = supervisor.find_player(socket.id);
    let game = player.game;

    game.remove_player(player);

    if (game.players.length == 0)
    {
      supervisor.remove_game(game);
      supervisor.io.emit(constants.ROOMS_LIST_SHOW, { rooms: supervisor.list_availables_rooms() });
    }
    else
      supervisor.send_data_to_room(game.room, constants.ROOM_UPDATE, { is_solo: game.is_solo, roomName: game.room, users: game.playersInfos() })
  });
}
