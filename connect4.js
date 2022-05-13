/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let GAMEOVER = false;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y<HEIGHT; y++) {
    board.push([]);
    for (let x = 0; x < WIDTH; x ++ ) {
      board[y].push(null);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');

  // TODO: add comment for this code
  let top = document.createElement("tr");                   //creating the element that will become the top row to click & place a piece
  top.setAttribute("id", "column-top");                     //setting ID for the tr to easily refer to it later
  top.className = "p"+currPlayer;                           // i added this to allow for CSS to color the top row boxes as you hover based on which player is active
  top.addEventListener("click", handleClick);               // adding event listener for when any of the top-row boxes are clicked

  for (let x = 0; x < WIDTH; x++) {                         //this for loop creates all the td cells in the top row and gives them IDs from 0 to the constant WIDTH-1
    const headCell = document.createElement("td");          //const is okay to use here since it'll be created w/ a new reference in each iteration of the for loop
    headCell.setAttribute("id", x);                         //creating ID that identifies the column / x-coordinate for later piece placement
    headCell.addEventListener('mouseenter',showHoverPiece); // show a 'ghost' piece when hovering over one of the top rows
    headCell.addEventListener('mouseleave',hideHoverPiece); // hide the ghost piece
    top.append(headCell);

  }
  htmlBoard.append(top);                                    //add the new td cells to the top row

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {                        //starting to create the actual play area of the board.  outer loop (y) creates HEIGHT # of columns and inner loop (x) adds WIDTH # of cells to each column
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `y${y}x${x}`);                //i changed id format from '1-2' to y${y}x${x} because HTML id naming conventions have long said an ID should start with a letter;  
      row.append(cell);                                     //on further research i learned HTML 5 allows for a number at the beginning of an id name, but i was//receiving an error message in 
    }                                                       //some early code i wrote and changing the format of the id string seemed to work
    htmlBoard.append(row);
  }
}

function showHoverPiece(evt) {
  const hoverCell = evt.target;
  const hoverPiece = document.createElement('div');
  hoverPiece.className='piece p'+currPlayer+' hover';
  hoverCell.append(hoverPiece);
}

function hideHoverPiece(evt) {
  evt.target.innerHTML='';
}


/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  if(board[0][x]!==null) return null;   // added this line to stop from adding a new piece to a column that's alreayd full.

  for (let i = 0; i<HEIGHT; i++) {      // for each column, loop through y coordinates from 0 until you find the first non-null value, then return the i right before ('above') it
    if (board[i][x] !== null) {
      return i-1;
    }
  }
  return HEIGHT-1;                      // if no non-null values are found in the search column, add a new piece to the very bottom

}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const sq = document.querySelector(`#y${y}x${x}`);
  const newPiece = document.createElement('div');

  newPiece.className = 'piece p'+currPlayer;
  sq.append(newPiece);

  
  
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
  GAMEOVER=true;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if(GAMEOVER) {
    return;
  }
  // get x from ID of clicked cell
  const x = +evt.target.parentElement.id;

  

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  } else {
    board[y][x]=currPlayer;
  }
  

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board



  
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!  Refresh your browser to restart`);
  }

  if(checkFullBoard()) {
    return endGame('The game ended in a draw! Refresh your browser to restart');
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2:1;
  document.querySelector('#column-top').className = 'p'+currPlayer;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
/* checkForWin works this way:
  1.  iterate over each square in the game board area.  
    1a.  from each square, create an array of 4 squares going to the right [[y,x], [y,x+1],[y,x+2],[y,x+3]]
    1b.  from each square, create an array of 4 squares going down in a similar fashion to the process in 1a;
    1c.  do the same as above going diagonally down & to the right
    1d.  same but down & to the left
  2.  as _win() if any one of these groups of 4 cells meet the following criteria:
    2a. neither y nor x are greater than the bounds set by global constants >=0 and <= HEIGHT & WIDTH respectively
    2b. the values for each square passed in the arrays all correspond to the current player id (e.g. all squares passed are the same color);
*/

  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {

      //   return true;
      // }
      if (_win(horiz)) {
        highlightWinningSquares(horiz);
        return true;
      }
      else if (_win(vert)) {
        highlightWinningSquares(vert);
        return true;
      }
      else if (_win(diagDR)) {
        highlightWinningSquares(diagDR);
        return true;
      }
      else if (_win(diagDL)) {
        highlightWinningSquares(diagDL);
        return true;
      }
    }
  }
}

function highlightWinningSquares(squares) {
  squares.forEach((c) => highlightSquare(c));
  return;
}

function highlightSquare(coords) {
  const sq = document.querySelector(`#y${coords[0]}x${coords[1]}`);

  sq.style.backgroundColor = currPlayer === 1? 'red':'blue';
}

function checkFullBoard() {   // this function checks to see if the board is filled with pieces.  it will only run if checkForWin doesn't return true;
  return board[0].every(sq => sq!==null);   //it only checks the very top row because if everything is filled there, it's implied that everything below it is filled as well
}

makeBoard();
makeHtmlBoard();
