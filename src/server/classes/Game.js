export default class Game
{
  constructor(room, player, supervisor)
  {
    this.room = room;
    this.supervisor = supervisor;
    this.players = [player];
    this.is_running = false;
    player.game = this;
  }

  is_available()
  {
    return !this.is_running;
  }

  addPlayer(player)
  {
    player.game = this;
    this.players.push(player);
  }

  removePlayer(player)
  {
    player.game = null;
    this.players.forEach((p, index) =>
    {
      if (p.name == player.name)
      {
        this.players.splice(index, 1);
        if (player.is_master)
        {
          if (this.players.length != 0)
            this.players[0].set_master(true);
          player.set_master(false);
        }
        return ;
      }  
    });
  }

  get players()
  {
    return this.players;
  }
}
