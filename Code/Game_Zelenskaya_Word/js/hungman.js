const letterContainer = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("user-input-section");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("result-text");
const endGameButton = document.getElementById("end-game-btn");

let timerElement = document.createElement("div");
timerElement.id = "timer";
document.querySelector(".container").prepend(timerElement);

let scoreElement = document.createElement("div");
scoreElement.id = "score";
document.querySelector(".container").prepend(scoreElement);

let options = {
  фрукты: ["Яблоко", "Банан", "Манго", "Ананас", "Персик", "Арбуз"],
  животные: ["Лошадь", "Носорог", "Слон", "Собака", "Панда", "Зебра"],
  страны: ["Россия", "Венгрия", "Италия", "Франция", "Мексика"],
};

let winCount = 0;
let count = 0;
let chosenWord = "";
let timer;
let timeRemaining = 120; 
let score = 0;
let gameOver = false;

// Получение текущего счета с предыдущих уровней
const getPreviousScore = () => {
  return parseInt(localStorage.getItem("playerScore") || "0");
};

const saveScore = () => {
  const totalScore = getPreviousScore() + score;
  localStorage.setItem("playerScore", totalScore);
};

const updateTimerDisplay = () => {
  timerElement.textContent = `Время: ${timeRemaining} секунд`;
};

const updateScoreDisplay = () => {
  const totalScore = getPreviousScore() + score;
  scoreElement.textContent = `Очки: ${totalScore}`;
};

// Запуск таймера
const startTimer = () => {
  updateTimerDisplay();
  timer = setInterval(() => {
    if (gameOver) {
      clearInterval(timer);
      return;
    }

    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0 && !gameOver) {
      clearInterval(timer);
      endGame("Время вышло! Вы проиграли.");
    }
  }, 1000);
};

const endGame = (message) => {
  if (gameOver) return;
  gameOver = true;

  clearInterval(timer);
  
  if (message.includes("выиграли")) {
    resultText.innerHTML = `<h2 class="win-animation">Вы выиграли!</h2><p>Слово: <span>${chosenWord}</span></p>`;
  } else {
    resultText.innerHTML = `<h2 class="lose-animation">Вы проиграли!</h2><p>Слово: <span>${chosenWord}</span></p>`;
  }
  
  blocker();
  saveScore();
  setTimeout(() => {
    window.location.href = "score.html";
  }, 3000);
};


// Показ доступных категорий
const displayOptions = () => {
  optionsContainer.innerHTML = `<h3>Выберите категорию:</h3>`;
  let buttonCon = document.createElement("div");
  for (let value in options) {
    buttonCon.innerHTML += `<button class="options" onclick="generateWord('${value}')">${value}</button>`;
  }
  optionsContainer.appendChild(buttonCon);
};

// Блокировка кнопок после завершения игры
const blocker = () => {
  let optionsButtons = document.querySelectorAll(".options");
  let letterButtons = document.querySelectorAll(".letters");
  optionsButtons.forEach((button) => {
    button.disabled = true;
  });
  letterButtons.forEach((button) => {
    button.disabled = true;
  });
};

// Генерация случайного слова
const generateWord = (optionValue) => {
  resultText.classList.remove("win-animation", "lose-animation");

  let optionsButtons = document.querySelectorAll(".options");
  optionsButtons.forEach((button) => {
    if (button.innerText.toLowerCase() === optionValue) {
      button.classList.add("active");
    }
    button.disabled = true;
  });

  letterContainer.classList.remove("hide");
  userInputSection.innerText = "";

  let optionArray = options[optionValue];
  chosenWord = optionArray[Math.floor(Math.random() * optionArray.length)];
  chosenWord = chosenWord.toUpperCase();

  let displayItem = chosenWord.replace(/./g, '<span class="dashes">_</span>');
  userInputSection.innerHTML = displayItem;
};


// Инициализация игры
const initializer = () => {
  winCount = 0;
  count = 0;
  score = 0;
  timeRemaining = 120;
  gameOver = false;

  userInputSection.innerHTML = "";
  optionsContainer.innerHTML = "";
  letterContainer.classList.add("hide");
  letterContainer.innerHTML = "";

  updateScoreDisplay();
  startTimer();

  for (let i = 1040; i <= 1071; i++) { 
    let button = document.createElement("button");
    button.classList.add("letters");
    button.innerText = String.fromCharCode(i);
    button.addEventListener("click", () => {
      if (gameOver) return;

      let charArray = chosenWord.split("");
      let dashes = document.getElementsByClassName("dashes");
      if (charArray.includes(button.innerText)) {
        button.style.backgroundColor = "green";
        charArray.forEach((char, index) => {
          if (char === button.innerText) {
            dashes[index].innerText = char;
            winCount += 1;
            if (winCount == charArray.length) {
              score += 50; 
              updateScoreDisplay();
              resultText.innerHTML = `<h2 class='win-msg'>Вы выиграли!</h2><p>Слово: <span>${chosenWord}</span></p>`;
              blocker();
              endGame("Вы выиграли!");
            }            
          }
        });
      } else {
        button.style.backgroundColor = "red";
        count += 1;
        drawMan(count);
        if (count == 6) {
          resultText.innerHTML = `<h2 class='lose-msg'>Вы проиграли!</h2><p>Слово: <span>${chosenWord}</span></p>`;
          blocker();
          endGame("Вы проиграли!");
        }
      }
      button.disabled = true;
    });
    letterContainer.append(button);
  }

  displayOptions();
  let { initialDrawing } = canvasCreator();
  initialDrawing();
};

// Рисование виселицы
const canvasCreator = () => {
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#fff";
  context.lineWidth = 2;

  const drawLine = (fromX, fromY, toX, toY) => {
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  };

  const head = () => {
    context.beginPath();
    context.arc(70, 30, 10, 0, Math.PI * 2, true);
    context.stroke();
  };

  const body = () => {
    drawLine(70, 40, 70, 80);
  };

  const leftArm = () => {
    drawLine(70, 50, 50, 70);
  };

  const rightArm = () => {
    drawLine(70, 50, 90, 70);
  };

  const leftLeg = () => {
    drawLine(70, 80, 50, 110);
  };

  const rightLeg = () => {
    drawLine(70, 80, 90, 110);
  };

  const initialDrawing = () => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawLine(10, 130, 130, 130);
    drawLine(10, 10, 10, 131);
    drawLine(10, 10, 70, 10);
    drawLine(70, 10, 70, 20);
  };

  return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

const drawMan = (count) => {
  let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
  switch (count) {
    case 1:
      head();
      break;
    case 2:
      body();
      break;
    case 3:
      leftArm();
      break;
    case 4:
      rightArm();
      break;
    case 5:
      leftLeg();
      break;
    case 6:
      rightLeg();
      break;
    default:
      break;
  }
};

// Обработчик кнопки "Завершить игру"
document.addEventListener("DOMContentLoaded", () => {
  if (endGameButton) {
    endGameButton.addEventListener("click", () => {
      endGame("Игра завершена.");
    });
  }
});

window.onload = initializer;
