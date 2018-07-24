import { UPDATE_SCORE, USER_LINE_DELETE, INDESTRUCTIBLE_LINE_ADD, ROOMS_LIST_SHOW, GAME_CREATION, ROOM_SHOW, GAME_START, NEXT_TETRI, BOARD_UPDATE, emptyBoardN } from '../../server/tools/constants';

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
    // j'ai qu'un joueur pour les tests
    socket.emit(USER_LINE_DELETE, {linesNumber: 3});
  });

  socket.on(NEXT_TETRI, (data) => {
    console.log('Listening NEXT_TETRI: ', data);
    // je creais direct pour tester la route
    socket.emit(BOARD_UPDATE, { board: emptyBoardN(20, 19) });
  });

  socket.on(BOARD_UPDATE, (data) => {
    console.log('Listening BOARD_UPDATE: ', data);
  });

  socket.on(INDESTRUCTIBLE_LINE_ADD, (data) => {
    // Faut plusieurs joueurs pour cette route
    console.log('Listening INDESTRUCTIBLE_LINE_ADD: ', data);
  });

  socket.on(UPDATE_SCORE, (data) => {
    console.log('Listening UPDATE_SCORE: ', data);
  });
}
