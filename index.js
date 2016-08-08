var bb = require('./bouncinBugs.js');
var solver = require('./solver.js');

var b = new bb.Board();
var x = bb.DOWN;
var test1 = [
  [0,x,x,0],
  [x,x,x,x],
  [x,x,x,x],
  [0,x,x,0]
];
var test2 = [
  [1,x,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
];
var test3 = [
  [x,x,x,x],
  [0,x,x,0],
  [0,x,x,0],
  [x,x,x,x]
];
b.board = test3;
b.print();

var solutions = solver.solve(b);

solutions.forEach(function(moves){
  console.log(moves.map(function(m){return m.toString();}).join(", "));

});
