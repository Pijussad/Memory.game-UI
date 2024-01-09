const pictures = [
    'image1.png',
    'image2.png',
    'image3.png',
    'image4.png',
    'image5.png',
    'image6.png',
    'image7.png',
    'image8.png',
    'image9.png',
    'image10.png',
];
let shuffledPictures = [];
let flippedCards = [];
let matchedPairs = 0;
let playerName = '';
let startTime;
let timerInterval;

function startGame() {
    playerName = document.getElementById('playerName').value || 'Anonymous';
    flippedCards = [];
    matchedPairs = 0;
    startTime = Date.now();
    updateTimer();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    shuffledPictures = shuffle([...pictures, ...pictures]);
    createGameBoard();
}

function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    shuffledPictures.forEach((picture, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.picture = picture;
        card.dataset.index = index;
        card.textContent = '?';
        card.addEventListener('click', flipCard);
        customizeCardAppearance(card);
        gameBoard.appendChild(card);
    });
}

function customizeCardAppearance(card) {
const randomSize = Math.floor(Math.random() * 50) + 80; // Random size between 80px and 130px
const randomColor = getRandomColor();

card.style.width = `${randomSize}px`;
card.style.height = `${randomSize}px`;
card.style.backgroundColor = randomColor;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let matchingInProgress = false;

function flipCard(event) {
console.log('flipCard function called'); // Debugging line

if (matchingInProgress) {
console.log('Matching in progress, returning'); // Debugging line
return; // Ignore clicks while matching is in progress
}

const card = event.target;
const index = card.dataset.index;

console.log(`Card index: ${index}`); // Debugging line

if (flippedCards.length < 2 && !flippedCards.includes(index)) {
console.log('Flipping card'); // Debugging line
card.classList.add('flipped');
card.innerHTML = `<img src="${shuffledPictures[index]}" alt="Memory Card">`;
flippedCards.push(index);

console.log(`Flipped cards: ${flippedCards}`); // Debugging line

if (flippedCards.length === 2) {
    console.log('Starting match check'); // Debugging line
    matchingInProgress = true; // Set matching in progress
    setTimeout(() => {
        checkMatch();
        matchingInProgress = false; // Reset matching status
    }, 500);
}
} else if (flippedCards.length === 1 && flippedCards[0] === index) {
console.log('Unflipping card'); // Debugging line
// Clicked the same card again, unflip it
card.classList.remove('flipped');
card.innerHTML = '?';
flippedCards = [];

setTimeout(() => {
    card.classList.add('flipped');
    card.innerHTML = `<img src="${shuffledPictures[index]}" alt="Memory Card">`;
}, 1000);
}
}



function checkMatch() {
const [index1, index2] = flippedCards;
const card1 = document.querySelector(`[data-index="${index1}"]`);
const card2 = document.querySelector(`[data-index="${index2}"]`);

if (shuffledPictures[index1] === shuffledPictures[index2]) {
// Matched
card1.removeEventListener('click', flipCard);
card2.removeEventListener('click', flipCard);
card1.style.opacity = 0;
card2.style.opacity = 0;
flippedCards = [];

matchedPairs++;
updateScore();

if (matchedPairs === pictures.length) {
    endGame();
}
} else {
// Not matched
// Not matched
setTimeout(() => {
if (card1) card1.textContent = '?';
if (card2) card2.textContent = '?';
flippedCards = [];
}, 1000);
}

matchingInProgress = true; // Reset matching status
}



function endGame() {
    clearInterval(timerInterval);
    const endTime = Date.now();
    const elapsedTime = Math.floor((endTime - startTime) / 1000);
    const score = calculateScore(elapsedTime);

    alert(`Congratulations, ${playerName}! You've completed the game in ${elapsedTime} seconds with a score of ${score}.`);
    saveResult(score);
    updateLeaderboard();
    startGame(); // Restart the game
}

function calculateScore(time) {
    // Score is just the total time taken to complete the game.
    return time;
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    timerElement.textContent = currentTime;
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    const score = calculateScore(Math.floor((Date.now() - startTime) / 1000));
    scoreElement.textContent = score;
}

function saveResult(score) {
    const bestResults = JSON.parse(sessionStorage.getItem('memoryGameResults')) || {};
    const previousBest = bestResults[playerName] || Infinity;

    if (score < previousBest) {
        bestResults[playerName] = score;
        sessionStorage.setItem('memoryGameResults', JSON.stringify(bestResults));
    }
}

function updateLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';

    const bestResults = JSON.parse(sessionStorage.getItem('memoryGameResults')) || {};

    Object.keys(bestResults).forEach((name) => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const scoreCell = document.createElement('td');

        nameCell.textContent = name;
        scoreCell.textContent = bestResults[name];

        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        leaderboardBody.appendChild(row);
    });
}

// Fisher-Yates Shuffle Algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initial game start
startGame();