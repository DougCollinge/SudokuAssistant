var cells = [];
for (var i = 0; i < 9; i++)
  cells[i] = new Array(9);

var allCells = [];
var cellsColumns = [];

var focussedrow = 0;
var focussedcol = 0;

function matrixMajor() {
  var major = document.createElement("TABLE");
  major.className = "majortable";
  for (var rmaj = 0; rmaj < 3; rmaj++) {
    var tr = document.createElement("TR");
    major.appendChild(tr);
    for (var cmaj = 0; cmaj < 3; cmaj++) {
      var td = document.createElement("TD");
      td.className = "majortd";
      tr.appendChild(td);
      td.appendChild(matrixMinor(rmaj, cmaj));
    }
  }
  return major;
}

function matrixMinor(rmaj, cmaj) {
  var minor = document.createElement("TABLE");
  minor.className = "minortable";
  for (var rmin = 0; rmin < 3; rmin++) {
    var tr = document.createElement("TR");
    minor.appendChild(tr);

    for (var cmin = 0; cmin < 3; cmin++) {
      var ir = rmaj * 3 + rmin;
      var ic = cmaj * 3 + cmin;
      var td = document.createElement("TD");
      td.className = "emptycell";
      tr.appendChild(td);

      cells[ir][ic] = td;
      allCells.push(td);

      td.tabIndex = ir * 9 + ic;

      td.cellrow = ir;
      td.cellcolumn = ic;
      td.cellsubmatrix = cmaj + 3 * rmaj;

      td.onclick = tdOnclick;
      td.onkeypress = tdOnkeypress;
    }
  }
  return minor;
}

function tdOnclick(event) {
  var cell = event.target;
  refocuscell(cell.cellrow, cell.cellcolumn);
  var eligibles = getEligibleDigits(cell);
  console.log("eligibles:", eligibles);
  return true;
}

function refocuscell(row, col) {
  focussedrow = row;
  focussedcol = col;
  clearcolours();
  markcells(row, col);
}

function tdOnkeypress(event) {
  var cs = String.fromCharCode(event.charCode);
  var cell = event.target;
  if (cell.className === "frozencells")
    return false;
  if (cs < "1" || cs > "9")
    return false;
  var eligibles = getEligibleDigits(cell);
  console.log("eligibles:", eligibles);
  if (eligibles.indexOf(cs) === -1)
    return false;

  cell.textContent = cs;
  cell.className = "livecells";
  cell.maxLength = 1;
  return true;
}


function makeCellsColumns() {
  for (var ic = 0; ic < 9; ic++) {
    cellsColumns.push([]);
    for (var ir = 0; ir < 9; ir++) {
      cellsColumns[ic].push(cells[ir][ic]);
    }
  }
}

function makeRelevantSet(r, c) {
  var relevant = [];
  // Add every cell in the same row that isn't the cell itself.
  for (var ir = 0; ir < 9; ir++)
    if (ir !== r)
      relevant.push(cells[ir][c]);

  // Add every cell in the same column that isn't the cell itself;
  for (var ic = 0; ic < 9; ic++)
    if (ic !== c)
      relevant.push(cells[r][ic]);

  // Add every cell in the same submatrix that isn't on the same row or column;
  var rlow = 3 * Math.floor(r / 3);
  var rhi = 3 * (1 + Math.floor(r / 3));
  var clow = 3 * Math.floor(c / 3);
  var chi = 3 * (1 + Math.floor(c / 3));
  var ret = [];

  for (var ir = rlow; ir < rhi; ir++) {
    for (var ic = clow; ic < chi; ic++) {
      if (ir !== r && ic !== c)
        relevant.push(cells[ir][ic]);
    }
  }

  // Now add this array to the cell as a property for future reference.
  cells[r][c].relevantCells = relevant;
}

function makeRelevantSets() {
  // Attach an array of all relevant cells to each cell as a property.
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      makeRelevantSet(r, c);
    }
  }
}

function clearcolours() {
  for (var c in allCells)
    allCells[c].style.backgroundColor = "white";
}

function markcells(r, c) {
  var relevants = cells[r][c].relevantCells;
  for (var i in relevants)
    relevants[i].style.backgroundColor = "rgb(220, 230, 255)";
  cells[r][c].style.backgroundColor = "lightblue";
}

function getEligibleDigits(cell) {
  var rdigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  var relevants = cell.relevantCells;

  for (var i in relevants) {
    if (relevants[i].className !== "emptycell") {
      var digit = relevants[i].textContent;
      if (digit.length !== 0) {
        var index = rdigits.indexOf(digit);
        if (index !== -1)
          rdigits.splice(index, 1); // Remove 1 at index of digit.
      }
    }
  }
  return rdigits;
}

function insertEligibleDigits(cell) {
  cell.textContent = "";
  var digits = getEligibleDigits(cell);
  for (var i in digits) {
    cell.textContent += digits[i];
  }
}

function freezecells() {
  clearcolours();
  for (var i in allCells) {
    var cell = allCells[i];
    if (cell.className === "livecells") {
      cell.readOnly = true;
      cell.className = "frozencells";
    } else if (cell.className === "emptycell") {
      insertEligibleDigits(cell);
    }
  }
}


var tablediv = document.getElementById("tablediv");
tablediv.appendChild(matrixMajor());
makeRelevantSets();

var freezebutton = document.getElementById("freezebutton");
freezebutton.onclick = freezecells;

var otherbutton = document.getElementById("otherbutton");
otherbutton.onclick =
        function (event) {
          var cell = event.target;
          var digits = getEligibleDigits(cell);
          var s = "";
          for (i in digits) {
            s += digits[i];
          }
          console.log("Eligable:", s);
        };

clearcolours();
refocuscell(focussedrow, focussedcol);


window.addEventListener("keydown", function (event) {
  // Install listener to handle all keystrokes.
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  // Handle all recognized non-printable keystrokes.
  switch (event.key) {
    case "ArrowDown":
      if (focussedrow < 8)
        focussedrow++;
      refocuscell(focussedrow, focussedcol);
      break;
    case "ArrowUp":
      if (focussedrow > 0)
        focussedrow--;
      refocuscell(focussedrow, focussedcol);
      break;
    case "ArrowLeft":
      if (focussedcol > 0)
        focussedcol--;
      refocuscell(focussedrow, focussedcol);
      break;
    case "ArrowRight":
      if (focussedcol < 8)
        focussedcol++;
      refocuscell(focussedrow, focussedcol);
      break;
    case "Enter":
      console.log("Enter!");
      clearcolours();
      break;
    case "Escape":
      // Do something for "esc" key press.
      break;
    default:

  }

  var cs = event.key;   // Get character representation of keypress.
  if (cs >= "1" && cs <= "9") {
    var cell = cells[focussedrow][focussedcol];
    if (cell.className !== "frozencells") { // Check if focussed cell is frozen.
      var eligibles = getEligibleDigits(cell); // Find all valid digits here.
      console.log("eligibles:", eligibles);
      if (eligibles.indexOf(cs) !== -1) { // Is incoming digit valid?
        cell.textContent = cs;
        cell.className = "livecells";
        cell.maxLength = 1;
      }
    }
  }
  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);


