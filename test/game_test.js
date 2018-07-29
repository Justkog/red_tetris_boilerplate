import chai from "chai"
import Player from '../src/server/classes/Player';
import Game from '../src/server/classes/Game';
import Supervisor from '../src/server/classes/Supervisor';
import { emptyBoardN } from '../src/server/tools/constants';

chai.should();
var expect = chai.expect;

describe('Fake Game test', function () {
  let game;
  let player;
  let supervisor;

  beforeEach(() => {
    supervisor = new Supervisor();
    player = new Player("randomstring", supervisor);
    player.is_master = true;
    game = new Game('toto', player, 15, false, supervisor);
  });

  it('should have correct initialisation', function () {
    expect(game.is_running).to.be.false;
    expect(game.pieces).to.be.empty;
    expect(game.is_solo).to.be.false;
    expect(game.room).to.be.eql("toto");
    expect(game.tetri_number).to.be.eql(15);
    expect(game.supervisor).to.be.not.a('null');
    player.set_name('titi');
    expect(game.players[0].name).to.be.eql('titi');
    expect(game.players[0].game.room).to.be.eql("toto");
  });

  it('should be available after create', function () {
    expect(game.is_available()).to.be.true;
  });

  it('should not be available if running or solo', function () {
    game.is_running = true;
    expect(game.is_available()).to.be.false;
    game.is_running = false;
    game.is_solo = true;
    expect(game.is_available()).to.be.false;
  });

  it('should know if game finished', function () {
    let player_two = new Player("plop", supervisor);
    game.addPlayer(player_two);
    expect(game.all_players_finished()).to.be.false;
    player_two.game_finished = true;
    expect(game.all_players_finished()).to.be.true;
  });

  it('should add new players', function () {
    let player_two = new Player("plop", supervisor);
    let player_three = new Player("raaaaah", supervisor);
    expect(game.players.length).to.be.eql(1);
    game.addPlayer(player_two);
    expect(game.players.length).to.be.eql(2);
    game.addPlayer(player_three);
    expect(game.players.length).to.be.eql(3);
  });

  it('should add new pieces', function () {
    expect(game.pieces.length).to.be.eql(0);
    game.addPieces();
    expect(game.pieces.length).to.be.eql(game.tetri_number);
    game.addPieces();
    expect(game.pieces.length).to.be.eql(game.tetri_number * 2);
  });

  it('should output players name with if master', function () {
    player.set_name('toto');
    expect(game.playersNames()).to.be.eql([{name: 'toto', is_master: true}]);
    let player_two = new Player("plop", supervisor);
    game.addPlayer(player_two);
    player_two.set_name('titi');
    expect(game.playersNames()).to.be.eql([{ name: 'toto', is_master: true }, { name: 'titi', is_master: false }]);
  });

  it('should output players without one', function () {
    player.set_name('toto');
    let player_two = new Player("plop", supervisor);
    game.addPlayer(player_two);
    player_two.set_master(true);
    player_two.set_name('titi');
    expect(game.playersWithoutOne(player).length).to.be.eql(1);
  });

  it('should output all pieces', function () {
    expect(game.pieces.length).to.be.eql(0);
    game.addPieces();
    expect(game.allTetris()[0]).to.have.keys('identifier', 'rotation');
    expect(game.allTetris()[14]).to.have.keys('identifier', 'rotation');
  });

  it('should output slice of pieces', function () {
    expect(game.pieces.length).to.be.eql(0);
    game.addPieces();
    game.addPieces();
    expect(game.nextTetris(1).length).to.be.eql(15);
    expect(game.allTetris().length).to.be.eql(30);
  });

  it('should output players boards', function () {
    player.set_name('toto');
    expect(game.playersBoards()).to.be.eql({toto: emptyBoardN(20, 10)});
    let player_two = new Player("plop", supervisor);
    game.addPlayer(player_two);
    player_two.set_name('titi');
    expect(game.playersBoards()).to.have.keys('toto', 'titi');
  });

  it('should output players scores', function () {
    player.set_name('toto');
    player.update_score(3);
    expect(game.playersScores()).to.be.eql({ toto: 3 });
    let player_two = new Player("plop", supervisor);
    game.addPlayer(player_two);
    player_two.set_name('titi');
    expect(game.playersScores()).to.have.keys('toto', 'titi');
  });

  it('should output players infos', function () {
    player.set_name('toto');
    player.update_score(3);
    expect(game.playersInfos()).to.be.eql({ toto: { score: 3, board: emptyBoardN(20, 10)} });
    let player_two = new Player("plop", supervisor);
    game.addPlayer(player_two);
    player_two.set_name('titi');
    expect(game.playersInfos()).to.have.keys('toto', 'titi');
  });

  it('should remove player', function () {
    let player_two = new Player("plop", supervisor);
    let player_three = new Player("raaaaah", supervisor);
    expect(game.players.length).to.be.eql(1);
    game.addPlayer(player_two);
    expect(game.players.length).to.be.eql(2);
    game.addPlayer(player_three);
    expect(game.players.length).to.be.eql(3);
    game.remove_player(player_three);
    expect(game.players.length).to.be.eql(2);
    game.remove_player(player_two);
    expect(game.players.length).to.be.eql(1);
  });

  it('should set new master on master leaving', function () {
    expect(player.is_master).to.be.true;
    let player_two = supervisor.add_player('new_player_two');
    game.addPlayer(player_two);
    expect(player_two.is_master).to.be.false;
    game.remove_player(player);
    expect(player_two.is_master).to.be.true;
  });
});