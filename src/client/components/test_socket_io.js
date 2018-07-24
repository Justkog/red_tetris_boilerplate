import io from 'socket.io-client';

export function test_socket_io(socket)
{
//   var socket = io(window.location.hostname + ':3004');
//   console.log('socket started');
  
//   socket.connect();
  
  socket.on('ROOMS_LIST_SHOW', (data) => {
    console.log(data);
    // je creais direct pour tester la route
    socket.emit('GAME_CREATION', { data: { room: 'room', name: 'name' } });
  });
}
