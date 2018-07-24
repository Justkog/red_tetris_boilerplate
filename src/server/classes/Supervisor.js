import Player from './Player';

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

  send_data(room, type, data)
  {
    this.io.sockets.in(room).emit(type, data);
  }

  find_player(socket_id)
  {
    this.players.forEach( (p) => 
      {
      if (p.socket_id == socket_id)
          return p;
      }
    );
    return null;
  }

  add_player(socket_id)
  {
    this.players.push(new Player(socket_id, this));
  }

  add_game(room, player)
  {
    this.games.push(new Game(room, player, this));
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
        rooms.push(g.name());
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
