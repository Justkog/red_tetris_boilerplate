import chai from "chai"
import Piece from '../src/server/classes/Piece';

chai.should();
var expect = chai.expect;

describe('Fake Piece test', function () {
  let piece;

  beforeEach(() => {
    piece = new Piece();
  });

  it('should have correct identifier', function () {
    ['I', 'O', 'T', 'L', 'J', 'Z', 'S'].should.include(piece.identifier);
  });

  it('should have correct rotation', function () {
    [0, 90, 180, 270].should.include(piece.rotation);
  });

});