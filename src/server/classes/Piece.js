const IDENTIFIERS = ['I', 'O', 'T', 'L', 'J', 'Z', 'S'];
const ROTATION = [0, 90, 180, 270];

export default class Piece
{
  constructor()
  {
    this.identifier = IDENTIFIERS[Math.floor(Math.random() * IDENTIFIERS.length)];
    this.rotation = ROTATION[Math.floor(Math.random() * ROTATION.length)];
  }
}
