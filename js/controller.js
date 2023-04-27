'use strict';
const restartButton = document.querySelector('.restartButton');
const cells = document.querySelectorAll('.cell');
const body = document.querySelector('body');
const playerXBc = document.querySelector('.playerX');
const playerOBc = document.querySelector('.playerO');
const overlay = document.querySelector('.overlay');
const messageBox = document.querySelector('.winnerMessage');
const audio = document.querySelectorAll('audio');
let activePlayer = true;

let movements = 0;
const cell = [];
let playerX = [];
let playerO = [];

class Cell {
  cellObject;
  constructor(DOMcell) {
    this.active = true;
    this.id = DOMcell.id.slice(1);
    this.cellObject = DOMcell;
  }
}


//    OVERLAY AND MODAL CONTROLLER
const showMessage = function (...params) {
  const [winner, message] = params;
  messageBox.children[0].textContent = winner;
  messageBox.children[1].textContent = message;
  messageBox.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// ON WIN/DRAW FUNCTIONS
const deactivateCells = function () {
  cell.forEach((cell) => (cell.active = false));
};

const onWin = function () {
  deactivateCells();
  if (activePlayer) {
    showMessage('X', 'WINS!');
  } else {
    showMessage('O', 'WINS!');
  }
  audio[3].play();
};

const onDraw = function () {
  deactivateCells();
  audio[4].play();
  showMessage('DRAW!', 'PLAY AGAIN!');
};

//    CHECKS WINNER

const checkIfWins = function (playerArray) {
  const wins = [
    ['00', '01', '02'],
    ['10', '11', '12'],
    ['20', '21', '22'],
    ['00', '10', '20'],
    ['01', '11', '21'],
    ['02', '12', '22'],
    ['00', '11', '22'],
    ['20', '11', '02'],
  ];

  for (const combination of wins) {
    const [one, two, three] = combination;
    if (
      playerArray.includes(one) &&
      playerArray.includes(two) &&
      playerArray.includes(three)
    )
      return true;
  }
  return false;
};

//   MAIN GAME CONTROLLER

const conquer = function () {
  const selectedCell = cell.find((cell) => cell.id === this.id.slice(1));
  if (!selectedCell.active) {
    audio[0].play();
    return;
  }
  movements++;
  let result;

  this.children[0].textContent = activePlayer ? 'X' : 'O';
  if (activePlayer) {
    playerX.push(selectedCell.id);
    audio[1].play();
    result = checkIfWins(playerX);
  } else {
    playerO.push(selectedCell.id);
    audio[2].play();
    result = checkIfWins(playerO);
  }

  if (!result && movements === 9) {
    onDraw();
    return;
  }
  if (!result) {
    body.classList.toggle('onXturn');
    body.classList.toggle('onOturn');
    playerOBc.classList.toggle('hidden');
    playerXBc.classList.toggle('hidden');
    activePlayer = !activePlayer;
    selectedCell.active = false;
    return;
  }
  onWin();
};

//& EVENT LISTENERS
cells.forEach((cll) => {
  cll.addEventListener('click', conquer);
  cell.push(new Cell(cll));
});

restartButton.addEventListener('click', function () {
  movements = 0;
  playerO = [];
  playerX = [];
  cell.forEach((cll) => {
    cll.active = true;
    cll.cellObject.children[0].textContent = '';
  });
  messageBox.classList.add('hidden');
  overlay.classList.add('hidden');
});