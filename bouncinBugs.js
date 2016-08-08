
var SIZE = 4;  // 4x4 grid

var UP = 1;
var DOWN = -1;

var Coord = function(r, c) {
    this.row = r;
    this.col = c;
};

var toLetter = function(coord){
  var alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var index = coord.row*SIZE + coord.col;
  if(index >= 0 && index < 26)
      return alph.charAt(index);
  return '?';
};

var fromLetter = function(letter){
  var alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var index = alph.indexOf(letter);
  if(index < 0){
    throw "Invalid letter" + letter
  }
  var r = index / SIZE;
  var c = index % SIZE;
  return new Coord(r, c);
};

var Move = function(start, end){
  this.start = start;
  this.end = end;
};

Move.prototype.toString = function(){
  return toLetter(this.start) + "-" + toLetter(this.end);
};

var IllegalMoveException = function(msg){
  this.name = "IllegalMoveException";
  this.message = msg;
}

var Board = function(board){
  this.board = [];
  for(var i=0;i<SIZE;i++){
    this.board.push([]);
    for(var j=0;j<SIZE;j++){
      if(board !== undefined)
        this.board[i][j] = board.board[i][j];
      else
        this.board[i].push(0);
    }
  }
  this.hash = 0;
};

Board.prototype.place = function(c, state){
  this.board[c.row][c.col] = state;
};
    // returns null if legal, reason otherwise
Board.prototype.check_move = function(m){
  if( m.start.row < 0 || m.start.row >= SIZE ||
    m.start.col < 0 || m.start.col >= SIZE ||
    m.end.row < 0 || m.end.row >= SIZE ||
    m.end.col < 0 || m.end.col >= SIZE)
    return "must be valid coords";
  if(this.board[m.start.row][m.start.col] === 0)
    return "must have piece to move";
  if(m.start.row === m.end.row && m.start.col === m.end.col)
    return "must not move to starting location";
  if(this.board[m.end.row][m.end.col] !== 0)
    return "must be empty in destination";
  if((
      Math.abs(m.start.col - m.end.col) !== 2 &&
      Math.abs(m.start.col - m.end.col) !== 0
    ) || (
      Math.abs(m.start.row - m.end.row) !== 2 &&
      Math.abs(m.start.row - m.end.row) !== 0
    )
  )
    return "must be the right distance away";
  if(this.board[(m.start.row + m.end.row)/2][(m.start.col + m.end.col)/2] === 0)
    return "there must be a piece to jump";
  return null;
};

Board.prototype.move = function(m) {

  var reason = this.check_move(m);
  if(reason !== null)
    throw new IllegalMoveException(reason);

  this.board[m.end.row][m.end.col] = this.board[m.start.row][m.start.col];
  // flip
  this.board[(m.start.row + m.end.row)/2][(m.start.col + m.end.col)/2] *= -1;
  this.board[m.start.row][m.start.col] = 0;
};

Board.prototype.isSolved = function(){
  for(var i=0;i < SIZE; i++){
    for(var j=0;j<SIZE;j++){
      if(this.board[i][j] === DOWN){
        return false;
      }else{
        //console.log(this.board[i][j] + " != " + DOWN);
      }
    }
  }
  return true;
};

Board.prototype.getNumDown = function(){
  var count = 0;
  for(var i=0;i < SIZE; i++){
    for(var j=0;j<SIZE;j++){
      if(this.board[i][j] === DOWN){
        count++;
      }
    }
  }
  return count;
};

Board.prototype.getNum = function(){
  var count = 0;
  for(var i=0;i < SIZE; i++){
    for(var j=0;j<SIZE;j++){
      if(this.board[i][j] !== 0){
        count++;
      }
    }
  }
  return count;
}
Board.prototype.print = function(){
  var out = "";
  out += "  |";
  for(var i=0;i < SIZE; i++){
    out += i + " ";
  }
  out += "\n";
  for(var i=-1;i < SIZE; i++){
    out += "--";
  }
  out += "\n";
  for(var i=0;i < SIZE; i++){
    out += i + " |";
    for(var j=0;j < SIZE; j++){
      if(this.board[i][j] == DOWN)
        out += "X ";
      else if(this.board[i][j] == UP)
        out += "O ";
      else
        out +=  "  ";
    }
    out += "\n";
  }
  console.log(out);
};

Board.prototype.equals = function(b){
  for(var i=0;i<SIZE;i++)
    for(var j=0;j<SIZE;j++)
      if(this.board[i][j] !== b.board[i][j])
        return false;
  return true;
};

Board.prototype.hashCode = function() {
  if(this.hash === 0) {
    for(var i=0;i<SIZE;i++)
      for(var j=0;j<SIZE;j++){
        //this.hash = this.hash << 2;
        if(this.board[i][j] === 0)
          this.hash = this.hash*3 + 0;
        if(this.board[i][j] === UP)
          this.hash = this.hash*3 + 1;
        if(this.board[i][j] === DOWN)
          this.hash = this.hash*3 + 2;
      }
  }
  return this.hash;
};


module.exports = {
  'Coord': Coord,
  'Move': Move,
  'Board': Board,
  'UP': UP,
  'DOWN': DOWN,
  'SIZE': SIZE
};
