export default class Player
{
  constructor(room, name)
  {
    this.room = room;
    this.name = name;
    this.score = 0;
  }

  update_score(value)
  {
    this.score += value;
  }

  get score()
  {
    return this.score;
  }

  get name()
  {
    return this.name;
  }

  get room()
  {
    return this.room;
  }
}