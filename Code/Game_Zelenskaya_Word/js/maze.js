let timeLeft = 120;
let timerInterval;
let playerScore = parseInt(localStorage.getItem('playerScore'), 10) || 0; // Текущий счет из localStorage

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = `Осталось времени: ${timeLeft} секунд`;
    }

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame("Время вышло!", false);
    }
}

function startTimer() {
    timeLeft = 120; 
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
    }, 1000);
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = playerScore;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    playerScore = parseInt(localStorage.getItem('playerScore'), 10) || 0; // Загружаем счет
    updateScoreDisplay(); 
});


// Завершение игры
function endGame(message, isWon) {
    clearInterval(timerInterval); 

    if (isWon) {
        playerScore += 30; 
    }

    localStorage.setItem('playerScore', playerScore);

    alert(`${message} Ваш счет: ${playerScore}`); 
    window.location.href = 'score.html';
}

//Завершение игры
document.addEventListener("DOMContentLoaded", () => {
    const endGameButton = document.getElementById("end-game-btn");
    if (endGameButton) {
        endGameButton.addEventListener("click", () => {
            endGame("Игра завершена.", false); 
        });
    }
});

function winGame() {
    playerScore += 30; 
    updateScoreDisplay();
    endGame("Вы прошли лабиринт! Поздравляем!", true); 
}

// Добавление обработчика для кнопки старта
document.querySelector('.startbtn').addEventListener('click', function () {
    this.style.display = 'none';

    resetPlayerPos();
    clearScreen();
    setup();
    draw();
    addListener();
    displayHidden();
    startTimer();
});


// Получение элемента canvas и контекста для рисования
const canvas = document.getElementById('mazeCanvas');
const pen = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;
let cellSize = 50;

const playerRadius = cellSize / 2 - 5;
const endRadius = cellSize / 2 - 5;

let trail = [];
let generatedMaze;
let solutionPath;

let points = 0;
const cols = Math.floor(width / cellSize);
const rows = Math.floor(height / cellSize);

// Начальная позиция игрока
const player1 = {
    x: 0,
    y: 0,
    color: 'red',
};

// Позиция цели
const end = {
    x: cols - 1,
    y: rows - 1,
    color: 'Black',
};

function addListener() {
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
    const key = event.key;
    movePlayer(key, player1);
    draw();
}

// Функция для отображения сообщения о неверном ходе
function showRestartMessage() {
    const messageBox = document.getElementsByClassName('msgbox')[0];
    messageBox.innerHTML = "Invalid Move. Press restart.";
    messageBox.innerHTML += `<br><button class='restartbtn' style='margin-top:70px;' onclick='resetState()'>Restart</button>`;
    messageBox.style.visibility = "visible";
    messageBox.style.fontSize = "1.7em";
    messageBox.style.color = "white";
    messageBox.style.fontFamily = `'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif`;
}

function resetState() {
    const messageBox = document.getElementsByClassName('msgbox')[0];
    messageBox.style.visibility = "hidden";

    let playerScore = parseInt(localStorage.getItem('playerScore'), 10) || 0;
    playerScore -= 5;

    localStorage.setItem('playerScore', playerScore);

    location.reload();
}


// Функция для перемещения игрока в зависимости от нажатой клавиши
function movePlayer(key, player) {
    let validMove = false;

    switch (key) {
        case 'ArrowUp':
            if (player.y > 0 && cells[player.x][player.y].walls.top === false) {
                player.y--;
                points++;
                validMove = true;
            }
            break;
        case 'ArrowDown':
            if (player.y < rows - 1 && cells[player.x][player.y].walls.bottom === false) {
                player.y++;
                points++;
                validMove = true;
            }
            break;
        case 'ArrowLeft':
            if (player.x > 0 && cells[player.x][player.y].walls.left === false) {
                player.x--;
                points++;
                validMove = true;
            }
            break;
        case 'ArrowRight':
            if (player.x < cols - 1 && cells[player.x][player.y].walls.right === false) {
                player.x++;
                points++;
                validMove = true;
            }
            break;
    }
    if (!validMove) {
        return;
    }

    const isTwice = trail.some(cell => cell.x === player.x && cell.y === player.y);
    if (isTwice) {
        showRestartMessage();
        resetPlayerPos();
    }

    if (player1.x === cols - 1 && player1.y === rows - 1) {
        document.removeEventListener('keydown', handleKeyPress);
    
        playerScore += 30;
        localStorage.setItem('playerScore', playerScore); // Сохраняем текущий счет в localStorage
    
        const messageBox = document.getElementsByClassName('msgbox')[0];
    
        // Отображаем сообщение о победе
        messageBox.innerHTML = "<h1>Вы выиграли!</h1>";
        messageBox.innerHTML += `<h2>Счет: ${playerScore}</h2>`;
        messageBox.innerHTML += `<button id="next-level" onclick="goToNextLevel()">3 уровень</button>`;
        messageBox.style.fontSize = "1em";
        messageBox.style.color = "black";
        messageBox.style.fontFamily = `'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif`;
        messageBox.style.visibility = "visible";
    }
}

function goToNextLevel() {
    window.location.href = 'hungman.html'; 
}

function clearScreen() {
    pen.canvas.width = pen.canvas.width;
}

function displayHidden() {
    document.getElementsByClassName('msgbox')[0].style.visibility = "hidden";
}

// Инициализация клеток
const cells = [];
for (let x = 0; x < rows; x++) {
    cells[x] = [];
    for (let y = 0; y < cols; y++) {
        cells[x][y] = null;
    }
}

// Класс для клетки лабиринта
class CellA {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visited = false;
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true,
        };
    }

    show() {
        const x = this.x * cellSize;
        const y = this.y * cellSize;

        pen.beginPath();

        if (this.walls.top) {
            pen.moveTo(x, y);
            pen.lineTo(x + cellSize, y);
        }

        if (this.walls.right) {
            pen.moveTo(x + cellSize, y);
            pen.lineTo(x + cellSize, y + cellSize);
        }

        if (this.walls.bottom) {
            pen.moveTo(x + cellSize, y + cellSize);
            pen.lineTo(x, y + cellSize);
        }

        if (this.walls.left) {
            pen.moveTo(x, y + cellSize);
            pen.lineTo(x, y);
        }
        pen.strokeStyle = '#C71585';
        pen.lineWidth = 5;
        pen.lineCap = "round";
        pen.stroke();
    }
}

function setup() {
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            cells[x][y] = new CellA(x, y);
        }
    }
    genMaze(0, 0);
}

// Генерация лабиринта
function genMaze(x, y) {
    const presentCell = cells[x][y];
    presentCell.visited = true;

    const directions = randomize(['top', 'right', 'bottom', 'left']);

    for (const direction of directions) {
        const dx = { top: 0, right: 1, bottom: 0, left: -1 }[direction];
        const dy = { top: -1, right: 0, bottom: 1, left: 0 }[direction];

        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
            const neighbour = cells[newX][newY];

            if (!neighbour.visited) {
                presentCell.walls[direction] = false;
                neighbour.walls[{ top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[direction]] = false;
                genMaze(newX, newY);
            }
        }
    }
    generatedMaze = cells.map(row => row.map(cell => ({ ...cell })));
    solutionPath = solveMaze();
}

function resetPlayerPos() {
    player1.x = 0;
    player1.y = 0;
    points = 0;
    trail = [];
}

// Функция для рисования лабиринта и движения игрока
function draw() {
    clearScreen();
    genMaze(player1.x, player1.y);

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            cells[x][y].show();
        }
    }
    trail.push({ x: player1.x, y: player1.y });
    pen.beginPath();
    for (let i = 0; i < trail.length; i++) {
        const trailX = trail[i].x * cellSize + cellSize / 2;
        const trailY = trail[i].y * cellSize + cellSize / 2;
        if (i === 0) {
            pen.moveTo(trailX, trailY);
        } else {
            pen.lineTo(trailX, trailY);
        }
    }
    pen.lineCap = "round";
    pen.strokeStyle = "white";
    pen.lineWidth = 4;
    pen.stroke();

    drawPlayer(player1);
    drawEnd();

    pen.strokeStyle = '#C71585';
    pen.lineWidth = 6;
    pen.lineCap = "round";
    pen.stroke();

    const isPartOfSolution = solutionPath.some(cell => cell.x === player1.x && cell.y === player1.y);

    if (!isPartOfSolution) {
        showRestartMessage();
        player1.x = 0;
        player1.y = 0;
        points = 0;
        trail = [];
        draw();
    }
}

// Функция для рисования игрока
function drawPlayer(player) {
    const x = player.x * cellSize + cellSize / 2;
    const y = player.y * cellSize + cellSize / 2;

    pen.beginPath();
    pen.arc(x, y, playerRadius, 0, 2 * Math.PI);
    pen.fillStyle = player.color;
    pen.fill();
}

// Функция для рисования цели
function drawEnd() {
    const x = (end.x + 0.5) * cellSize;
    const y = (end.y + 0.5) * cellSize;

    pen.font = `${cellSize / 2}px Arial`; 
    pen.fillStyle = end.color;           
    pen.textAlign = "center";           
    pen.textBaseline = "middle";       
    pen.fillText("Кот", x, y);           
}

// Функция для перемешивания массива
function randomize(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function solveMaze() {
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const path = [];

    function dfs(x, y) {
        if (x < 0 || x >= cols || y < 0 || y >= rows || visited[y][x]) {
            return false;
        }

        visited[y][x] = true;
        path.push({ x, y });

        if (x === cols - 1 && y === rows - 1) {
            return true;
        }

        const cell = generatedMaze[x][y];

        if (!cell.walls.top && dfs(x, y - 1)) {
            return true;
        }
        if (!cell.walls.right && dfs(x + 1, y)) {
            return true;
        }
        if (!cell.walls.bottom && dfs(x, y + 1)) {
            return true;
        }
        if (!cell.walls.left && dfs(x - 1, y)) {
            return true;
        }

        path.pop();
        return false;
    }

    dfs(0, 0);
    return path;
}

setup();
draw();
