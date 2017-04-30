console.log("Javascript sandbox...");

function SudokuMatrix() {
  this.cells = new Array(9*9);
}
SudokuMatrix.prototype = new Object();

SudokuMatrix.prototype.cells = null;

SudokuMatrix.prototype.set = 
function(r,c,x) {
  this.cells[c + r*9] = x;
};

SudokuMatrix.prototype.get =
function(r,c) {
    return this.cells[c + r*9];
};

var matrix = new SudokuMatrix();
console.log("matrix:",matrix);

matrix.set(0,0,"cow");
matrix.set(2,1,"pig");

console.log("matrix:",matrix.get(0,0));
console.log("matrix:",matrix.get(2,1));
console.log("matrix:",matrix.get(2,2));

var arr = new Array(3);
for(i=0;i<3;i++) {
  console.log("i:",i);
  arr[i] = new Array(3);
}
// arr[3][1] = 3;
// arr[5][2] = 5;

console.log("arr:",arr);

var arr2 = ["horse","goat","sheep"];
for(var i in arr2) console.log("arr2 i:",i);
