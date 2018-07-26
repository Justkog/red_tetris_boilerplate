import chai from "chai"
import Player from '../src/server/classes/Player';
import Game from '../src/server/classes/Game';
import Supervisor from '../src/server/classes/Supervisor';
import { emptyBoardN } from '../src/server/tools/constants';

chai.should();
var expect = chai.expect;

describe('Fake Supervisor test', function () {
  let game;
  let player;
  let supervisor;

  beforeEach(() => {
    supervisor = new Supervisor();
  });

  it('should have correct initialisation', function () {
    expect(supervisor.games).to.be.empty;
    expect(supervisor.players).to.be.empty;
    expect(supervisor.io).to.be.a('null');
  });

  it('should find if player name is available', function () {
    expect(supervisor.player_name_available('toto')).to.be.true;
    supervisor.add_player('plop');
    supervisor.players[0].set_name('toto');
    expect(supervisor.player_name_available('toto')).to.be.false;
    expect(supervisor.player_name_available('titi')).to.be.true;
  });

  it('should find if game room name is available', function () {
    expect(supervisor.game_name_available('toto')).to.be.true;
    player = new Player("randomstring", supervisor);
    supervisor.add_game('toto', player, 15, false);
    expect(supervisor.game_name_available('toto')).to.be.false;
    expect(supervisor.game_name_available('titi')).to.be.true;
  });

  it('should find a player', function () {
    supervisor.add_player('new_player');

    expect(supervisor.find_player('new_player').socket_id).to.be.eql('new_player');
    expect(supervisor.find_player('not found')).to.be.undefined;
  });

  it('should find a game', function () {
    player = new Player("randomstring", supervisor);
    supervisor.add_game('new_game', player, 15, false);

    expect(supervisor.find_game('new_game').room).to.be.eql('new_game');
    expect(supervisor.find_game('not found')).to.be.undefined;
  });

  it('should add a player', function () {
    expect(supervisor.players.length).to.be.eql(0);
    supervisor.add_player('new_player');
    expect(supervisor.players.length).to.be.eql(1);
    supervisor.add_player('new_player_two');
    expect(supervisor.players.length).to.be.eql(2);
  });

  it('should add a game', function () {
    player = new Player("randomstring", supervisor);
    expect(supervisor.games.length).to.be.eql(0);
    supervisor.add_game('new_game', player, 15, false);
    expect(supervisor.games.length).to.be.eql(1);
    supervisor.add_game('new_game_two', player, 15, false);
    expect(supervisor.games.length).to.be.eql(2);
  });

  it('should output list of available game', function () {
    player = new Player("randomstring", supervisor);
    expect(supervisor.list_availables_rooms()).to.be.empty;
    supervisor.add_game('new_game', player, 15, false);
    expect(supervisor.list_availables_rooms()).to.be.eql(['new_game']);
    supervisor.add_game('new_game_two', player, 15, false);
    expect(supervisor.list_availables_rooms()).to.be.eql(['new_game', 'new_game_two']);
    supervisor.games[0].is_running = true;
    expect(supervisor.list_availables_rooms()).to.be.eql(['new_game_two']);
  });

  it('should remove player', function () {
    player = supervisor.add_player('new_player');
    supervisor.add_game('new_game', player, 15, false);
    expect(supervisor.players.length).to.be.eql(1);
    let player_two = supervisor.add_player('new_player_two');
    expect(supervisor.players.length).to.be.eql(2);
    supervisor.remove_player(player_two);
    expect(supervisor.players.length).to.be.eql(1);
    supervisor.remove_player(player);
    expect(supervisor.players.length).to.be.eql(0);
  });

  it('should remove game', function () {
    player = supervisor.add_player('new_player');
    let game_one = supervisor.add_game('new_game', player, 15, false);
    expect(supervisor.games.length).to.be.eql(1);
    let game_two = supervisor.add_game('new_game_two', player, 15, false);
    expect(supervisor.games.length).to.be.eql(2);
    supervisor.remove_game(game_one);
    expect(supervisor.games.length).to.be.eql(1);
    supervisor.remove_game(game_two);
    expect(supervisor.games.length).to.be.eql(0);
  });
});