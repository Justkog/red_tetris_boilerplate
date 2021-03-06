import { emptyBoardN } from '../tools/constants';

export default class Player
{
  constructor(socket_id, supervisor)
  {
    this.socket_id = socket_id;
    this.is_master = false;
    this.is_ready = false;
    this.score = 0;
    this.game = null;
    this.game_finished = false;
    this.room = null;
    this.name = null;
    this.supervisor = supervisor;
    this.piece_index = 0;
    this.board = emptyBoardN(20, 10);
  }

  set_master(value)
  {
    this.is_master = value;
  }

  set_room(room)
  {
    this.room = room;
  }

  set_name(name)
  {
    this.name = name;
  }

  set_game(game)
  {
    this.game = game;
  }

  update_score(value)
  {
    this.score += value;
  }

  update_piece_index()
  {
    this.piece_index += 1;
  }

  reset()
  {
    this.game_finished = false;
    this.is_ready = false;
    this.piece_index = 0;
    this.score = 0;
    this.board = emptyBoardN(20, 10);
  }
}
