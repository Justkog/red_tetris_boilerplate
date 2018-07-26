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

  player_game_available(name)
  {
    let games_filtered = this.games.filter((g) => {
      return g.name === name;
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

  find_game(name)
  {
    let games_filtered = this.games.filter((g) => {
      if (g.name === name)
        return g;
    }
    );
    return games_filtered[0];
  }

  add_player(socket_id)
  {
    this.players.push(new Player(socket_id, this));
  }

  add_game(room, player, tetri_number)
  {
    let game = new Game(room, player, tetri_number, this);
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
    let room = game.room();

    this.games.forEach((g, index) => {
      if (g.room() === room) {
        this.games.splice(index, 1);
        return;
      }
    }
    );
  }

  list_availables_rooms()
  {
    let rooms = [];

    this.games.forEach((g) => {
      if (g.is_available())
      {
        rooms.push(g.name);
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
