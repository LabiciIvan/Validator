let player = "X", emptySquares = 9;
let stopGame = false;
let board = [["", "", ""],
["", "", ""],
["", "", ""]];

document.querySelectorAll('#square').forEach(box => { box.addEventListener("click", startGame, { once: true }) });

function startGame(index) {
  if (stopGame || emptySquares == 0) return;
  let squareClicked = index.target;
  let line = squareClicked.getAttribute("line");
  let column = squareClicked.getAttribute("column");
  squareClicked.innerHTML = player;
  board[line][column] = player;
  switchPlayer();
  checkWin();
}

function switchPlayer() {
  if (player == "X") {
    player = "O";
  } else {
    player = "X";
  }
  --emptySquares;
}

function win(winner) {
  if (stopGame) return;
  stopGame = true;
  if (winner == "X" || winner == "O") {
    stop(winner);
  } else {
    stop();
  }
}

function checkWin() {
  for (let i = 0; i < board.length; ++i) {
    let square1 = board[i][0]; // check lines
    let square2 = board[i][1];
    let square3 = board[i][2];
    if (square1 == square2 && square2 == square3 && square1 != "" && square2 != "" && square3 != "") {
      win(square1);
    }
    square1 = board[0][i]; // check columns
    square2 = board[1][i];
    square3 = board[2][i];
    if (square1 == square2 && square2 == square3 && square1 != "" && square2 != "" && square3 != "") {
      win(square1);
    }
    square1 = board[0][0]; // check diagonal left
    square2 = board[1][1];
    square3 = board[2][2];
    if (square1 == square2 && square2 == square3 && square1 != "" && square2 != "" && square3 != "") {
      win(square1);
    }
    square1 = board[0][2]; // check diagonal right
    square2 = board[1][1];
    square3 = board[2][0];
    if (square1 == square2 && square2 == square3 && square1 != "" && square2 != "" && square3 != "") {
      win(square1);
    }
  }
  if (emptySquares == 0) {
    win();
  }
}

function restart() {
  window.location.reload();
}

function stop(winner) {
  let message = winner;
  document.getElementById('finish').setAttribute('class', 'stop');
  let x = document.getElementById('text');
  x.setAttribute('class', 'info');
  x.onclick = restart;
  if (message == "X" || message == "O") {
    x.innerHTML = "winner: " + winner + " play again";
  } else 
  {
    x.innerHTML = "DRAW Play-Again";
  }
}