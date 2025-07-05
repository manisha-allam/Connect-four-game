const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 'red';
let gameOver = false;
let vsAI = false;

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const modeButton = document.querySelector("button[onclick='toggleMode()']");

function createBoard() {
  boardElement.innerHTML = '';
  board = [];
  for (let r = 0; r < ROWS; r++) {
    board[r] = [];
    for (let c = 0; c < COLS; c++) {
      board[r][c] = null;

      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      boardElement.appendChild(cell);
    }
  }
}

function resetGame() {
  createBoard();
  currentPlayer = 'red';
  gameOver = false;
  statusElement.textContent = `Player Red's Turn`;
}

function toggleMode() {
  vsAI = !vsAI;
  modeButton.textContent = vsAI ? "🎮 Mode: Player vs AI" : "🎮 Mode: 2 Players";
  resetGame();
}

function makeMove(col) {
  if (gameOver) return false;

  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = currentPlayer;
      const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
      cell.classList.add(currentPlayer);

      if (checkWin(row, col)) {
        statusElement.textContent = `Player ${capitalize(currentPlayer)} Wins! 🎉`;
        gameOver = true;
      } else if (isBoardFull()) {
        statusElement.textContent = "It's a Draw!";
        gameOver = true;
      } else {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        statusElement.textContent = vsAI && currentPlayer === 'yellow'
          ? `AI's Turn`
          : `Player ${capitalize(currentPlayer)}'s Turn`;
      }
      return true;
    }
  }
  return false;
}

boardElement.addEventListener('click', (e) => {
  const col = +e.target.dataset.col;
  if (isNaN(col) || gameOver) return;

  if (makeMove(col) && vsAI && currentPlayer === 'yellow') {
    setTimeout(aiMove, 500);
  }
});

function aiMove() {
  if (gameOver) return;
  let col;
  do {
    col = Math.floor(Math.random() * COLS);
  } while (!isValidMove(col));
  makeMove(col);
}

function isValidMove(col) {
  return !board[0][col];
}

function isBoardFull() {
  return board[0].every(cell => cell !== null);
}

function checkWin(r, c) {
  const directions = [
    [[0, 1], [0, -1]],
    [[1, 0], [-1, 0]],
    [[1, 1], [-1, -1]],
    [[1, -1], [-1, 1]],
  ];

  for (let dir of directions) {
    let count = 1;
    for (let [dr, dc] of dir) {
      let row = r + dr;
      let col = c + dc;
      while (
        row >= 0 &&
        row < ROWS &&
        col >= 0 &&
        col < COLS &&
        board[row][col] === currentPlayer
      ) {
        count++;
        row += dr;
        col += dc;
      }
    }
    if (count >= 4) return true;
  }
  return false;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

createBoard();
