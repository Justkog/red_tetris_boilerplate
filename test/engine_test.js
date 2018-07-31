import chai from "chai"
import Supervisor from '../src/server/classes/Supervisor';
import * as constant from '../src/server/tools/constants';
import { emptyBoardN } from '../src/server/tools/constants';

import { startServer } from './helpers/server'
import io from 'socket.io-client'
import params_test from '../params_test'

chai.should();
var expect = chai.expect;

describe('Fake Engine test', function(){
  let supervisor;
  let server;
  let player_one;
  let player_two;

  beforeEach(() => {
    supervisor = new Supervisor();
    startServer(params_test.server, supervisor, function (err, s) {
      server = s
    });
    player_one = io('http://0.0.0.0:5000');
  });

  afterEach((done) => {
    player_one.disconnect();
    server.stop(done);
  });

  it('GAME_CREATION_SOLO', function(done){
    player_one.connect();
    player_one.emit(constant.GAME_CREATION_SOLO, { userName: 'name', tetriNumber: 15});
    player_one.on(constant.ROOM_UPDATE, (data) => {
      expect(JSON.stringify(data.users)).to.be.eq(JSON.stringify({'name': {'score': 0, 'board': emptyBoardN(20, 10), 'ready': false, 'is_master': true }}));
      expect(data.roomName).to.be.not.a('null');
      done()
    }
    );
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
    }
    );
  });

  it('NEXT_TETRI error', function (done) {
    player_one.connect();
    player_one.emit(constant.NEXT_TETRI, {});
    player_one.on(constant.GAME_ERROR, (data) => {
      expect(data.message).to.be.eq('no game found');
      done()
    }
    );
  });

  it('NEXT_TETRI error', function (done) {
    player_one.connect();
    player_one.emit(constant.NEXT_TETRI, {});
    player_one.on(constant.GAME_ERROR, (data) => {
      expect(data.message).to.be.eq('no game found');
      done()
    }
    );
  });

  it('GAME_JOIN', function (done) {
    player_one.connect();
    player_one.emit(constant.GAME_JOIN, { userName: 'name', roomName: 'room', tetriNumber: 15 });
    player_one.on(constant.ROOM_UPDATE, (data) => {
      expect(JSON.stringify(data.users)).to.be.eq(JSON.stringify({ 'name': { 'score': 0, 'board': emptyBoardN(20, 10), 'ready': false, 'is_master': true } }));
      expect(data.roomName).to.be.not.a('null');
      done()
    }
    );
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
    }
    );
  });

  it('PLAYER_END', function (done) {
    player_one.connect();
    player_one.emit(constant.GAME_JOIN, { userName: 'name', roomName: 'room', tetriNumber: 15 });
    player_one.emit(constant.PLAYER_READY, { });
    player_one.emit(constant.GAME_START, { });
    player_one.emit(constant.PLAYER_END, {});
    player_one.on(constant.PLAYER_END, (data) => {
      expect(data.game_finished).to.be.true;
      done()
    }
    );
  });

  it('PLAYER_END', function (done) {
    player_one.connect();
    player_one.emit(constant.GAME_JOIN, { userName: 'name', roomName: 'room', tetriNumber: 15 });
    player_one.emit(constant.PLAYER_READY, {});
    player_one.emit(constant.GAME_START, {});
    player_one.emit(constant.PLAYER_END, {});
    player_one.on(constant.PLAYER_END, (data) => {
      expect(data.game_finished).to.be.true;
      done()
    }
    );
  });

});
