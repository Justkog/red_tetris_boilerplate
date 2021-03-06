import * as constants from '../tools/constants';
import Player from './Player';
import Game from './Game';

import { initEngine } from '../tools/engine'
import { loginfo } from '../tools/logs';

export default class Supervisor
{
  constructor()
  {
    this.players = [];
    this.games = [];
    this.io = null;
  }

  init_socket()
  {
    initEngine(this.io, this);
  }

  send_data_to_room(room, type, data)
  {
    this.io.sockets.in(room).emit(type, data);
  }

  player_name_available(name)
  {
    let players_filtered = this.players.filter((p) => {
      return p.name === name;
    }
    );
    return players_filtered[0] === undefined;
  }

  game_name_available(room)
  {
    let games_filtered = this.games.filter((g) => {
      return g.room === room;
    }
    );
    return games_filtered[0] === undefined;
  }

  find_player(socket_id)
  {
    let players_filtered = this.players.filter( (p) =>
      {
        if (p.socket_id === socket_id)
          return p;
      }
    );
    return players_filtered[0];
  }

  find_game(room)
  {
    let games_filtered = this.games.filter((g) => {
      if (g.room === room)
        return g;
    }
    );
    return games_filtered[0];
  }

  add_player(socket_id)
  {
    let player = new Player(socket_id, this);
    this.players.push(player);
    return player;
  }

  add_game(room, player, tetri_number, is_solo)
  {
    let game = new Game(room, player, tetri_number, is_solo, this);
    this.games.push(game);
    game.addPieces(tetri_number);
    player.is_master = true;
    return game;
  }

  remove_player(player)
  {
    let socket_id = player.socket_id;

    this.players.forEach((p, index) => {
      if (p.socket_id === socket_id) {
        this.players.splice(index, 1);
        return;
      }
    }
    );
  }

  remove_game(game)
  {
    let room = game.room;

    this.games.forEach((g, index) => {
      if (g.room === room) {
        this.games.splice(index, 1);
        return;
      }
    }
    );
    if (this.io)
      this.io.emit(constants.ROOMS_LIST_SHOW, { rooms: this.list_availables_rooms() });
  }

  list_availables_rooms()
  {
    let rooms = [];

    this.games.forEach((g) => {
      if (g.is_available())
      {
        rooms.push(g.room);
      }
  	});
    return rooms;
  }


  set_io(app)
  {
    this.io = require('socket.io')(app);
  }

  get_io()
  {
    return this.io;
  }
}
