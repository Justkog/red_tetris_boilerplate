import Player from './Player';
import Game from './Game';

import { initEngine } from '../tools/engine'

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

  add_player(socket_id)
  {
    this.players.push(new Player(socket_id, this));
  }

  add_game(room, player, tetri_number)
  {
    let game = new Game(room, player, tetri_number, this);
    this.games.push(game);
    game.addPieces(tetri_number);
    return game;
  }

  remove_player(player)
  {
    let name = player.name();
    let room = player.room();

    this.players.forEach((p, index) =>
      {
        if (p.name() == name && p.room() == room)
        {
          this.players.splice(index, 1);
          return ;
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
    }
    );
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
