import Player from './Player';
import debug from 'debug'

const logerror = debug('tetris:error')
  , loginfo = debug('tetris:info')

const initEngine = (io, supervisor) => {
  io.on('connection', function (socket) {
    loginfo("Socket connected: " + socket.id)

    socket.on('room', function (room) {
      socket.join(room);
      supervisor.send_data(room, 'message', 'Is it working ?');
    });

    socket.emit('news', { hello: 'world' });

    socket.on('action', (action) =>
    {
      if (action.type === 'server/ping')
      {
        socket.emit('action', { type: 'pong' })
      }
    })
  })
}

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

  is_player_available(room, name)
  {
    this.players.forEach( (p) => 
      {
        if (p.name() == name && p.room() == room)
          return false;
      }
    );
    return true;
  }

  add_player(room, name)
  {
    this.players.push( new Player(room, name) );
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

  set_io(app)
  {
    this.io = require('socket.io')(app);
    console.log('Done');
  }

  get_io()
  {
    return this.io;
  }
}
