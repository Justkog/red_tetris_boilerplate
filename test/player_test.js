import chai from "chai"
import Player from '../src/server/classes/Player';
import Game from '../src/server/classes/Game';
import Supervisor from '../src/server/classes/Supervisor';
import { emptyBoardN } from '../src/server/tools/constants';

chai.should();
var expect = chai.expect;

describe('Fake Player test', function () {
  let player;
  let supervisor;

  beforeEach(() => {
    supervisor = new Supervisor();
    player = new Player("randomstring", supervisor);
  });

  it('should have correct initialisation', function () {
    expect(player.socket_id).to.be.a('string');
    expect(player.is_master).to.be.false;
    expect(player.game_finished).to.be.false;
    expect(player.game).to.be.a('null');
    expect(player.room).to.be.a('null');
    expect(player.name).to.be.a('null');
    expect(player.score).to.be.eql(0);
    expect(player.piece_index).to.be.eql(0);
    expect(player.board).to.be.eql(emptyBoardN(20, 10));
  });

  it('should set correct master', function () {
    player.set_master(true);
    expect(player.is_master).to.be.true;
    player.set_master(false);
    expect(player.is_master).to.be.false;
  });

  it('should set correct room', function () {
    player.set_room('toto');
    expect(player.room).to.be.eql('toto');
    player.set_room('titi');
    expect(player.room).to.be.eql('titi');
  });

  it('should set correct name', function () {
    player.set_name('toto');
    expect(player.name).to.be.eql('toto');
    player.set_name('titi');
    expect(player.name).to.be.eql('titi');
  });

  it('should set correct game', function () {
    let game_one = new Game('toto', player, 15, false, supervisor);
    player.game = game_one;
    expect(player.game.room).to.be.eql('toto');
    let game_two = new Game('titi', player, 15, false, supervisor);
    player.game = game_two;
    expect(player.game.room).to.be.eql('titi');
  });

  it('should set correct score', function () {
    player.update_score(1);
    expect(player.score).to.be.eql(1);
    player.update_score(4);
    expect(player.score).to.be.eql(5);
  });

  it('should set correct piece_index', function () {
    expect(player.piece_index).to.be.eql(0);
    player.update_piece_index();
    expect(player.piece_index).to.be.eql(1);
    player.update_piece_index();
    expect(player.piece_index).to.be.eql(2);
  });

});