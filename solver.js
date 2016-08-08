var bb = require("./bouncinBugs.js");
var buckets = require('buckets-js');
var DEBUG = true;

var BoardState = function(board, moves) {
  this.moves = [];
  this.board = new bb.Board(board);
  if(moves !== undefined)
    for(var m in moves){
      this.moves.push(moves[m]);
    }
};

var solve = function(b){
  var solutions = [];
  var pq = new buckets.PriorityQueue(
    function(b1, b2) {
      // by least moves, then by least DOWN
      if(b1.moves.length - b2.moves.length != 0)
          return b2.moves.length - b1.moves.length;
      else
          return b2.board.getNumDown() - b1.board.getNumDown();
    }
  );
  var old_states = {};
  var init = new BoardState(b);
  pq.add(init);

  if(init.board.isSolved()){
      solutions.push(init.moves);
      console.log("NOTHING TO DO");
      return solutions;
  }
  var bs;
  var iteration = 0;
  var max_iteration = 1000000;
  var min_down = Number.MAX_VALUE;
  while(iteration < max_iteration){
      // expand this board state
      bs = pq.dequeue();
      // bs is undefined if we are done
      if(bs === undefined)
          break;
      if(iteration % 10000 === 0 && DEBUG)
          console.log(
              iteration + " Moves:" + bs.moves.length +
              " NumDown:" + bs.board.getNumDown() +
              " PQ_SIZE:" + pq.size() +
              " old_states_size: " + Object.keys(old_states).length);
      expandBoardState(bs, pq, solutions, old_states);
      iteration++;
  }
  if(iteration === max_iteration)
      console.log(
        " Max iteration hit. Stopping. Found " +
        solutions.length + " solutions"
      );
  else if(pq.isEmpty())
      if(solutions.length == 0)
          console.log("Impossible: analyzed " + iteration + " states");
      else
          console.log("Solved completely: analyzed " + iteration + " states");

  return solutions;
};

var expandBoardState = function(bs, pq, solutions, old_states) {
  for(var i = 0; i < bb.SIZE; i++)for(var j = 0; j < bb.SIZE; j++){
    if(bs.board.board[i][j] != 0){  // try each piece
      // try every move
      for(var k = 0; k < bb.SIZE; k++)for(var l = 0; l < bb.SIZE; l++){
      // ok now try the move
        var move = new bb.Move(new bb.Coord(i, j), new bb.Coord(k, l));
        if(bs.board.check_move(move) === null){
          // create new board stat instance, save for later
          var newbs = new BoardState(bs.board, bs.moves);
          // try new move and see if solved it
          newbs.board.move(move);
          newbs.moves.push(move);

          if(newbs.board.isSolved()){
            solutions.push(newbs.moves);
            if(DEBUG)console.log("Found Solution: " +
              newbs.moves.map(function(m){return m.toString();}).join(", ")
            );
            return;
          }

          // only add new state if it is new
          var is_old_board = false;
          if(old_states.hasOwnProperty(newbs.board.hashCode())){
            // use hash code, but fall back to
            //    equals to double check
            var old_board = old_states[newbs.board.hashCode()];
            if(newbs.board.equals(old_board)){
              is_old_board = true;
            }else{
              console.log("HASH COLLISION DETECTED");
              newbs.board.print();
              old_board.print();
              console.log(newbs.board.hashCode());
              console.log(old_board.hashCode());
            }
          }
          if(!is_old_board){
            pq.add(newbs);
            old_states[newbs.board.hashCode()] = newbs.board;
          }
        }
      }
    }
  }
};
module.exports = {
  'solve': solve
}
