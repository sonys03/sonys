document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const playerNameInput = document.getElementById('player-name');

    if (startButton) {
        startButton.addEventListener('click', () => {
            const playerName = playerNameInput.value.trim();

            if (playerName === '') {
                alert('Пожалуйста, введите ваше имя!');
            } else {
                localStorage.setItem('playerName', playerName);
                localStorage.setItem('playerScore', 0);
                window.location.href = 'game.html';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const playerNameElement = document.getElementById('player-name');
    const playerScoreElement = document.getElementById('player-score');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const timerElement = document.getElementById('timer');
    const endGameButton = document.getElementById('end-game-btn');
    const messageElement = document.createElement('p');
    messageElement.id = 'message';
    answersElement.after(messageElement);

    const playerName = localStorage.getItem('playerName') || 'Игрок';
    let playerScore = parseInt(localStorage.getItem('playerScore'), 10) || 0;
    if (playerNameElement) playerNameElement.textContent = playerName;
    if (playerScoreElement) playerScoreElement.textContent = playerScore;

    const levels = [
        {
            type: 'Легкий',
            questions: [
                { question: 'Выберите слово, начинающееся на "К"', answers: ['Кошка', 'Слон', 'Утка'], correct: 'Кошка' },
            { question: 'Выберите слово, начинающееся на "М"', answers: ['Слон', 'Молоко', 'Корабль'], correct: 'Молоко' },
            { question: 'Выберите слово, начинающееся на "С"', answers: ['Солнце', 'Утка', 'Луна'], correct: 'Солнце' }
            ],
            baseScore: 10,
            penalty: 5,
            timeLimit: 30
        },
        {
            type: 'Средний',
        },
        {
            type: 'Сложный'
        }
    ];

    let currentLevelIndex = 0;
    let timer;
    let timeRemaining;

    function startTimer(timeLimit) {
        timeRemaining = timeLimit;
        updateTimerDisplay();

        timer = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();

            if (timeRemaining <= 0) {
                clearInterval(timer);
                endGame('Время вышло!');
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        if (timerElement) {
            timerElement.textContent = `Осталось времени: ${timeRemaining} секунд`;
        }
    }

    function loadQuestion() {
        const currentLevel = levels[currentLevelIndex];
        const randomQuestionIndex = Math.floor(Math.random() * currentLevel.questions.length);
        const currentQuestion = currentLevel.questions[randomQuestionIndex];

        questionElement.textContent = currentQuestion.question;
        messageElement.textContent = ''; 
        answersElement.innerHTML = '';

        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => checkAnswer(answer, currentQuestion.correct));
            answersElement.appendChild(button);
        });
    }

    function checkAnswer(selectedAnswer, correctAnswer) {
        const currentLevel = levels[currentLevelIndex];
    
        if (selectedAnswer === correctAnswer) {
            playerScore += currentLevel.baseScore;
            playerScoreElement.textContent = playerScore;
            localStorage.setItem('playerScore', playerScore);
    
            currentLevelIndex++;
            if (currentLevelIndex < levels.length) {
                clearInterval(timer);

                if (levels[currentLevelIndex].type === 'Средний') {
                    window.location.href = 'maze.html';
                    return; 
                }
    
                if (levels[currentLevelIndex].type === 'Сложный') {
                    window.location.href = 'hungman.html';
                    return; 
                }
    
                startTimer(levels[currentLevelIndex].timeLimit);
                loadQuestion();
            } else {
                endGame('Вы успешно завершили игру!');
            }
        } else {

            playerScore -= currentLevel.penalty;
            playerScoreElement.textContent = playerScore;
            localStorage.setItem('playerScore', playerScore);

            loadQuestion();
        }
    }
    
    function endGame(message) {
        clearInterval(timer);
        alert(`${message} Ваш счет: ${playerScore}`);
        window.location.href = 'score.html';
    }

    if (endGameButton) {
        endGameButton.addEventListener('click', () => endGame('Игра завершена.'));
    }

    startTimer(levels[currentLevelIndex].timeLimit);
    loadQuestion();
});

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('score.html')) {
        clearInterval(window.timer);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const currentPlayerNameElement = document.getElementById('current-player-name');
    const currentPlayerScoreElement = document.getElementById('current-player-score');
    const playersListElement = document.getElementById('players-list');
    const restartButton = document.getElementById('restart-btn');

    const currentPlayerName = localStorage.getItem('playerName') || 'Игрок';
    const currentPlayerScore = parseInt(localStorage.getItem('playerScore'), 10) || 0;

    if (currentPlayerNameElement) {
        currentPlayerNameElement.textContent = currentPlayerName;
    }

    if (currentPlayerScoreElement) {
        currentPlayerScoreElement.textContent = currentPlayerScore;
    }

    const players = JSON.parse(localStorage.getItem('players') || '[]');

    if (currentPlayerName && !isNaN(currentPlayerScore)) {
        const existingPlayerIndex = players.findIndex(player => player.name === currentPlayerName);
        if (existingPlayerIndex > -1) {
            if (currentPlayerScore > players[existingPlayerIndex].score) {
                players[existingPlayerIndex].score = currentPlayerScore;
            }
        } else {
            players.push({ name: currentPlayerName, score: currentPlayerScore });
        }
    }

    players.sort((a, b) => b.score - a.score);
    localStorage.setItem('players', JSON.stringify(players));

    if (playersListElement) {
        playersListElement.innerHTML = '';
        players.forEach(player => {
            if (player.name && !isNaN(player.score)) {
                const listItem = document.createElement('li');
                listItem.textContent = `${player.name}: ${player.score} очков`;
                playersListElement.appendChild(listItem);
            }
        });
    }

    if (restartButton) {
        restartButton.addEventListener('click', () => {
            localStorage.removeItem('playerName');
            localStorage.removeItem('playerScore');
            window.location.href = 'index.html';
        });
    }
});


