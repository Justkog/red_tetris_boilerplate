import io from 'socket.io-client';

export function test_socket_io(socket)
{
//   var socket = io(window.location.hostname + ':3004');
//   console.log('socket started');
  
//   socket.connect();
  
  socket.on('ROOMS_LIST_SHOW', (data) => {
    console.log('Listening ROOMS_LIST_SHOW: ', data);
    // je creais direct pour tester la route
    socket.emit('GAME_CREATION', { roomName: 'room', userName: 'name', tetriNumber: 15 });
  });

  socket.on('ROOM_SHOW', (data) => {
    console.log('Listening ROOM_SHOW: ', data);
    // je creais direct pour tester la route
    socket.emit('GAME_START', { roomName: 'room' });
  });

  socket.on('GAME_START', (data) => {
    console.log('Listening GAME_START: ', data);
    // je creais direct pour tester la route
    socket.emit('NEXT_TETRI');
    socket.emit('NEXT_TETRI');
    socket.emit('NEXT_TETRI');
  });

  socket.on('NEXT_TETRI', (data) => {
    console.log('Listening NEXT_TETRI: ', data);
    // je creais direct pour tester la route
    // socket.emit('NEXT_TETRI');
  });
}
