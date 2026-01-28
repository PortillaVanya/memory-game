const board = document.getElementById('game-board');
const startBtn = document.getElementById('start-btn');
const difficultySelect = document.getElementById('difficulty');
const movesSpan = document.getElementById('moves');
const timerSpan = document.getElementById('timer');

let emojis = [
  '🍎','🍌','🍇','🍓','🍑','🍍','🥝','🍉',
  '🍒','🍋','🥭','🍈','🍏','🫐','🥥','🍊',
  '🍠','🌽'
];

let timer;
let time = 0;
let moves = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
  clearInterval(timer);
  time = 0;
  timerSpan.textContent = `Tiempo: 0s`;
  timer = setInterval(() => {
    time++;
    timerSpan.textContent = `Tiempo: ${time}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function updateMoves() {
  moves++;
  movesSpan.textContent = `Movimientos: ${moves}`;
}

function getGridColumns(level) {
  switch(level) {
    case 'easy': return 'repeat(4, 1fr)';
    case 'medium': return 'repeat(4, 1fr)';
    case 'hard': return 'repeat(6, 1fr)';
    case 'expert': return 'repeat(6, 1fr)';
  }
}

function getPairsCount(level) {
  switch(level) {
    case 'easy': return 6;
    case 'medium': return 8;
    case 'hard': return 12;
    case 'expert': return 18;
  }
}

function createBoard() {
  board.innerHTML = '';
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;
  moves = 0;
  movesSpan.textContent = `Movimientos: 0`;
  stopTimer();

  const level = difficultySelect.value;
  const numPairs = getPairsCount(level);
  totalPairs = numPairs;

  board.style.gridTemplateColumns = getGridColumns(level);

  let selectedEmojis = shuffle(emojis).slice(0, numPairs);
  let pairEmojis = [...selectedEmojis, ...selectedEmojis];
  pairEmojis = shuffle(pairEmojis);

  pairEmojis.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.textContent = '';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });

  startTimer();
}

function flipCard() {
  if (lockBoard) return;
  if (this.classList.contains('flipped')) return;

  this.classList.add('flipped');
  this.textContent = this.dataset.symbol;
  updateMoves();

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  matchedPairs++;
  if (matchedPairs === totalPairs) {
    stopTimer();
    setTimeout(() => {
      alert(`¡Ganaste! 🎉\nMovimientos: ${moves}\nTiempo: ${time} segundos`);
    }, 300);
  }
  resetTurn();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    firstCard.textContent = '';
    secondCard.textContent = '';
    resetTurn();
  }, 1000);
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

startBtn.addEventListener('click', createBoard);
