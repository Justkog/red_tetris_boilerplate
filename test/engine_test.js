import chai from "chai"
import Supervisor from '../src/server/classes/Supervisor';
import * as constant from '../src/server/tools/constants';

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
      expect(JSON.stringify(data.users)).to.be.eq(JSON.stringify([{ 'name': 'name', 'is_master': true }]));
      expect(data.roomName).to.be.not.a('null');
      done()
    }
    );
  });
});
