import chai from "chai"
import Supervisor from '../src/server/classes/Supervisor';
import * as constant from '../src/server/tools/constants';
import { emptyBoardN } from '../src/server/tools/constants';

import { startServer } from './helpers/server'
import io from 'socket.io-client'
import params_test from '../params_test'

chai.should();
var expect = chai.expect;

function init_one_player(player_one, start)
{
  player_one.connect();
  player_one.emit(constant.GAME_JOIN, { userName: 'name', roomName: 'room', tetriNumber: 15 });
  player_one.emit(constant.PLAYER_READY, {});
  if (start)
    player_one.emit(constant.GAME_START, {});
}

function init_two_players(player_one, player_two, start)
{
  player_one.connect();
  player_two.connect();
  player_one.emit(constant.GAME_JOIN, { userName: 'name', roomName: 'room', tetriNumber: 15 });
  player_two.emit(constant.GAME_JOIN, { userName: 'name2', roomName: 'room', tetriNumber: 15 });
  player_one.emit(constant.PLAYER_READY, {});
  player_two.emit(constant.PLAYER_READY, {});
  if (start)
    player_one.emit(constant.GAME_START, {});
}

function init_three_players(player_one, player_two, player_three, start)
{
  player_one.connect();
  player_two.connect();
  player_three.connect();
  player_one.emit(constant.GAME_JOIN, { userName: 'name', roomName: 'room', tetriNumber: 15 });
  player_two.emit(constant.GAME_JOIN, { userName: 'name2', roomName: 'room', tetriNumber: 15 });
  player_three.emit(constant.GAME_JOIN, { userName: 'name3', roomName: 'room', tetriNumber: 15 });
  player_one.emit(constant.PLAYER_READY, {});
  player_two.emit(constant.PLAYER_READY, {});
  player_three.emit(constant.PLAYER_READY, {});
  if (start)
    player_one.emit(constant.GAME_START, {});
}

describe('Fake Engine test', function(){
  let supervisor;
  let server;
  let player_one;
  let player_two;
  let player_three;

  beforeEach(() => {
    supervisor = new Supervisor();
    startServer(params_test.server, supervisor, function (err, s) {
      server = s
    });
    player_one = io('http://0.0.0.0:5000');
    player_two = io('http://0.0.0.0:5000');
    player_three = io('http://0.0.0.0:5000');
  });

  afterEach((done) => {
    player_one.disconnect();
    player_two.disconnect();
    player_three.disconnect();
    server.stop(done);
  });

  it('GAME_CREATION_SOLO', function(done){
    player_one.connect();
    player_one.emit(constant.GAME_CREATION_SOLO, { userName: 'name', tetriNumber: 15});
    player_one.on(constant.ROOM_UPDATE, (data) => {
      expect(JSON.stringify(data.users)).to.be.eq(JSON.stringify({'name': {'score': 0, 'board': emptyBoardN(20, 10), 'ready': false, 'is_master': true }}));
      expect(data.roomName).to.be.not.a('null');
      done()
    });
  });

  it('GAME_CREATION_SOLO - player already in game', function (done) {
    let index = 1;
    init_two_players(player_one, player_two, true);
    player_one.emit(constant.GAME_CREATION_SOLO, { tetriNumber: 15 });
    player_one.emit(constant.GAME_START, { });
    player_one.on(constant.ROOM_UPDATE, (data) => {
      if (index < 7)
        ;
      else
      {
        expect(Object.keys(data.users).length).to.be.eq(1);
        done()
      }
      index += 1;
    });
  });

  it('GAME_CREATION_SOLO - player name unavailable', function (done) {
    let index = 1;
    init_two_players(player_one, player_two, true);
    player_three.connect();
    player_three.emit(constant.GAME_CREATION_SOLO, { userName: 'name', tetriNumber: 15 });
    player_three.on(constant.PLAYER_ERROR, (data) => {
      expect(data.message).to.be.eq('name already taken');
      done()
    });
  });

  it('GAME_JOIN - change game', function (done) {
    let index = 1;

    init_one_player(player_one, true);
    player_one.emit(constant.GAME_JOIN, { roomName: 'toto', tetriNumber: 15 });
    player_one.on(constant.ROOM_UPDATE, (data) => {
      if (index < 5)
        ;
      else
      {
        expect(data.roomName).to.be.eq('toto');
        done()
      }
      index += 1;
    });
  });

  it('NEXT_TETRI', function (done) {
    let index = 1;
  
    player_one.connect();
    player_one.emit(constant.GAME_JOIN, { userName: 'name', roomName: 'room', tetriNumber: 15 });
    player_one.emit(constant.NEXT_TETRI, { });
    player_one.on(constant.NEXT_TETRI, (data) => {
      expect(data.tetris.length).to.be.eq(15);
      player_one.emit(constant.NEXT_TETRI, {});
      if (index == 2)
        done()
      index += 1;
    });
  });

  it('NEXT_TETRI error', function (done) {
    player_one.connect();
    player_one.emit(constant.NEXT_TETRI, {});
    player_one.on(constant.GAME_ERROR, (data) => {
      expect(data.message).to.be.eq('no game found');
      done()
    });
  });

  it('NEXT_TETRI - two players', function (done) {
    init_two_players(player_one, player_two, true);
    player_one.emit(constant.NEXT_TETRI, {});
    player_two.emit(constant.NEXT_TETRI, {});
    player_two.on(constant.NEXT_TETRI, (data) => {
      expect(data.tetris.length).to.be.eq(15);
      done()
    });
  });

  it('GAME_JOIN', function (done) {
    player_one.connect();
    player_one.emit(constant.GAME_JOIN, { userName: 'name', roomName: 'room', tetriNumber: 15 });
    player_one.on(constant.ROOM_UPDATE, (data) => {
      expect(JSON.stringify(data.users)).to.be.eq(JSON.stringify({ 'name': { 'score': 0, 'board': emptyBoardN(20, 10), 'ready': false, 'is_master': true } }));
      expect(data.roomName).to.be.not.a('null');
      done()
    });
  });

  it('GAME_START - player not master', function (done) {
    init_two_players(player_one, player_two, false);
    player_two.emit(constant.GAME_START, { });
    player_two.on(constant.PLAYER_ERROR, (data) => {
      expect(data.message).to.be.not.a('player is not master');
      done()
    });
  });

  it('GAME_START - not all players ready', function (done) {
    init_two_players(player_one, player_two, false);
    player_three.connect();
    player_three.emit(constant.GAME_JOIN, { userName: 'name3', roomName: 'room', tetriNumber: 15 });
    player_one.emit(constant.GAME_START, { });
    player_one.on(constant.GAME_ERROR, (data) => {
      expect(data.message).to.be.not.a('waiting for players');
      done()
    });
  });

  it('GAME_START - game already started', function (done) {
    init_two_players(player_one, player_two, true);
    player_three.connect();
    player_three.emit(constant.GAME_JOIN, { userName: 'name3', roomName: 'room', tetriNumber: 15 });
    player_three.emit(constant.GAME_START, { });
    player_three.on(constant.GAME_ERROR, (data) => {
      expect(data.message).to.be.not.a('game already started');
      done()
    });
  });

  it('PLAYER_READY', function (done) {
    let index = 1;
    player_one.connect();
    player_one.emit(constant.GAME_JOIN, { userName: 'name', roomName: 'room', tetriNumber: 15 });
    player_one.on(constant.ROOM_UPDATE, (data) => {
      if (index == 1)
      {
        expect(data.roomName).to.be.eq('room');
        player_one.emit(constant.PLAYER_READY, {});
        index += 1;
      }
      else
      {
        expect(JSON.stringify(data.users)).to.be.eq(JSON.stringify({ 'name': { 'score': 0, 'board': emptyBoardN(20, 10), 'ready': true, 'is_master': true } }));
        done()
      }
    });
  });

  it('PLAYER_READY - error', function (done)
  {
    player_one.connect();
    player_one.emit(constant.PLAYER_READY, { board: [] });
    player_one.on(constant.GAME_ERROR, (data) => {
      expect(data.message).to.be.eq('game not found');
      done()
    })
  });

  it('PLAYER_END - with reset', function (done) {
    init_two_players(player_one, player_two), true;
    player_two.emit(constant.PLAYER_END, {});
    player_one.on(constant.PLAYER_END, (data) => {
      expect(data.game_finished).to.be.true;
      done()
    });
  });

  it('PLAYER_END - without reset', function (done)
  {
    init_three_players(player_one, player_two, player_three, true);
    player_two.emit(constant.PLAYER_END, {});
    player_one.on(constant.PLAYER_END, (data) => {
      expect(data.game_finished).to.be.false;
      done()
    });
  });

  it('USER_LINE_DELETE - indestructible', function (done) {
    init_two_players(player_one, player_two, true)
    player_one.emit(constant.USER_LINE_DELETE, { linesNumber: 4});
    player_two.on(constant.INDESTRUCTIBLE_LINES_ADD, (data) => {
      expect(data.linesNumber).to.be.eq(3);
      done()
    });
  });

  it('USER_LINE_DELETE - score', function (done) {
    init_two_players(player_one, player_two, true)
    player_one.emit(constant.USER_LINE_DELETE, { linesNumber: 1 });
    player_two.on(constant.UPDATE_SCORE, (data) => {
      expect(JSON.stringify(data.scores)).to.be.eq('{"name":1,"name2":0}');
      done()
    });
  });

  it('BOARD_UPDATE - spectrum', function (done) {
    init_two_players(player_one, player_two, true)
    let board = emptyBoardN(20, 10);
    board[3][3] = 1;
    player_one.emit(constant.BOARD_UPDATE, { board: board });
    player_two.on(constant.SPECTRUM_UPDATE, (data) => {
      expect(data.user).to.be.eq('name');
      expect(JSON.stringify(data.board)).to.be.eq(JSON.stringify(board));
      done()
    })
  });

  it('BOARD_UPDATE - error', function (done) {
    player_one.connect();
    player_one.emit(constant.BOARD_UPDATE, { board: [] });
    player_one.on(constant.GAME_ERROR, (data) => {
      expect(data.message).to.be.eq('game not found');
      done()
    })
  });

  it('GAME_LEAVE - with remaining players', function (done) {
    let index = 1;
    init_two_players(player_one, player_two, true)
    player_one.emit(constant.ROOM_LEAVE, { board: [] });
    player_two.on(constant.ROOM_UPDATE, (data) => {
      if (index < 6)
        ;
      else
      {
        expect(Object.keys(data.users).length).to.be.eq(1);
        done()
      }
      index += 1;
    })
  });

  it('GAME_LEAVE - without remaining players', function (done) {
    init_one_player(player_one, true)
    player_one.emit(constant.ROOM_LEAVE, { board: [] });
    player_one.on(constant.ROOMS_LIST_SHOW, (data) => {
      expect(data.rooms.length).to.be.empty;
      done()
    })
  });

  it('PLAYERS_MESSAGE', function (done) {
    init_two_players(player_one, player_two, false)
    player_one.emit(constant.PLAYERS_MESSAGE, { message: 'test' });
    player_two.on(constant.PLAYERS_MESSAGE, (data) => {
      expect(data.message).to.be.eq('[name] test');
      done()
    })
  });

  it('PLAYERS_MESSAGE - without game', function (done) {
    player_one.connect()
    player_one.emit(constant.PLAYERS_MESSAGE, { message: 'test' });
    player_one.on(constant.GAME_ERROR, (data) => {
      expect(data.message).to.be.eq('game not found');
      done()
    })
  });
});
