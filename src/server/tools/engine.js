import * as constants from './constants';
import { loginfo } from './logs';

export const initEngine = (io, supervisor) => {
  io.on('connection', function (socket) {
    loginfo("Socket connected: " + socket.id);

    socket.on(constants.GAME_CREATION, function (data) {
      let player = supervisor.find_player(socket.id);
      player.set_name(data.userName);
      let game = supervisor.add_game(data.roomName, player);
      socket.join(data.roomName);
    });

    supervisor.add_player(socket.id);
    socket.emit(constants.ROOMS_LIST_SHOW, { rooms: supervisor.list_availables_rooms() });

  })
}