import io from 'socket.io-client';
import { ROOMS_LIST_SHOW, GAME_CREATION, ROOM_SHOW, GAME_START, NEXT_TETRI } from '../../server/tools/constants';

export function test_socket_io(socket)
{
  socket.on(ROOMS_LIST_SHOW, (data) => {
    console.log('Listening ROOMS_LIST_SHOW: ', data);
    // je creais direct pour tester la route
    socket.emit(GAME_CREATION, { roomName: 'room', userName: 'name', tetriNumber: 15 });
  });

  socket.on(ROOM_SHOW, (data) => {
    console.log('Listening ROOM_SHOW: ', data);
    // je creais direct pour tester la route
    socket.emit(GAME_START, { roomName: 'room' });
  });

  socket.on(GAME_START, (data) => {
    console.log('Listening GAME_START: ', data);
    // je creais direct pour tester la route
    socket.emit(NEXT_TETRI);
    socket.emit(NEXT_TETRI);
    socket.emit(NEXT_TETRI);
  });

  socket.on(NEXT_TETRI, (data) => {
    console.log('Listening NEXT_TETRI: ', data);
    // je creais direct pour tester la route
    // socket.emit(NEXT_TETRI);
  });
}
