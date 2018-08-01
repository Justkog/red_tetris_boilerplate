import * as constants from '../tools/constants';
import Piece from './Piece';

export default class Game
{
  constructor(room, player, tetri_number, is_solo, supervisor)
  {
    this.room = room;
    this.tetri_number = tetri_number;
    this.supervisor = supervisor;
    this.players = [player];
    this.pieces = [];
    this.is_running = false;
    this.is_solo = is_solo;
    player.game = this;
  }

  is_available()
  {
    return !this.is_running && !this.is_solo;
  }

  all_players_finished()
  {
    let names = this.players.filter(player => { return !player.game_finished } );

    return names.length <= 1;
  }

  is_game_ready()
  {
    if (this.is_solo)
      return true;
    let player_ready = this.players.filter(player => { return !player.is_ready });

    return player_ready.length == 0;
  }

  addPlayer(player)
  {
    player.game = this;
    this.players.push(player);
  }

  addPieces()
  {
    let new_pieces = Array.apply(null, { length: this.tetri_number }).map(() => { return new Piece(); } )
    this.pieces.push.apply(this.pieces, new_pieces);
  }

  playersNames()
  {
    let names = [];

    this.players.forEach(player => {
      names.push({ name: player.name, is_master: player.is_master });
    });

    return names;
  }

  playersWithoutOne(player)
  {
    return this.players.filter((p) => { return p.socket_id != player.socket_id });
  }

  allTetris()
  {
    let tetris = [];
    this.pieces.forEach(tetri => {
      tetris.push({identifier: tetri.identifier, rotation: tetri.rotation});
    });

    return tetris;
  }

  nextTetris(index)
  {
    return this.pieces.slice(index, index + this.tetri_number);
  }

  playersBoards()
  {
    let boards = {};

    this.players.forEach(player => {
      boards[player.name] = player.board;
    });

    return boards;
  }

  playersScores()
  {
    let scores = {};

    this.players.forEach(player => {
      scores[player.name] = player.score;
    });

    return scores;
  }
  
  playersInfos()
  {
    let infos = {};

    this.players.forEach(player => {
      infos[player.name] = {score: player.score, board: player.board, ready: player.is_ready, is_master: player.is_master};
    });

    return infos;
  }

  remove_player(player)
  {
    player.game = null;
    this.players.forEach((p, index) =>
    {
      if (p.socket_id === player.socket_id)
      {
        this.players.splice(index, 1);
        if (player.is_master)
        {
          if (this.players.length != 0)
            this.players[0].set_master(true);
          player.set_master(false);
        }
        if (this.supervisor.io)
        {
          this.supervisor.send_data_to_room(this.room, constants.ROOM_UPDATE, { is_solo: this.is_solo, roomName: this.room, users: this.playersInfos() })
          if (this.is_running)
            this.supervisor.send_data_to_room(this.room, constants.PLAYER_END, { users: this.playersInfos(), game_finished: this.all_players_finished() })
          if (this.all_players_finished())
            this.reset();
        }
        return ;
      }  
    });
  }

  reset()
  {
    this.is_running = false;
    this.pieces = [];
    this.addPieces(this.tetri_number);
    this.players.forEach((p) =>
    {
      p.reset();
    });
    if (this.supervisor.io)
      this.supervisor.send_data_to_room(this.room, constants.ROOM_UPDATE, { is_solo: this.is_solo, roomName: this.room, users: this.playersInfos() })
  }
}
