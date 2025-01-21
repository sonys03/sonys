function task2() {
    window.location.href = 'task2.html';
}

function task3() {
    window.location.href = 'task3.html';
}

function task4() {
    window.location.href = 'task4.html';
}

function task5() {
    window.location.href = 'task5.html';
}

function coursework() {
    window.location.href = 'Game_Zelenskaya_Word/index.html';
}

document.addEventListener("DOMContentLoaded", () => {
  const latinPhrases = [
    "Consuetudo est altera natura",
    "Nota bene",
    "Nulla calamitas sola",
    "Per aspera ad astra",
  ];
  const russianTranslations = [
    "Привычка - вторая натура",
    "Заметьте хорошо!",
    "Беда не приходит одна",
    "Через тернии к звёздам",
  ];

  let usedIndexes = [];
  let clickCount = 0;

  const addRowBtn = document.getElementById("addRowBtn");
  const repaintBtn = document.getElementById("repaintBtn");
  const phraseTableBody = document.querySelector("#phraseTable tbody");

  // Добавление новой строки
  addRowBtn.addEventListener("click", () => {
    if (usedIndexes.length === latinPhrases.length) {
      alert("Фразы закончились");
      return;
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * latinPhrases.length);
    } while (usedIndexes.includes(randomIndex));

    usedIndexes.push(randomIndex);
    console.log(usedIndexes)

    const rowClass = clickCount % 2 === 0 ? "class1" : "class2";
    clickCount++;

    // Создание строки таблицы
    const row = document.createElement("tr");
    row.classList.add(rowClass);

    const latinCell = document.createElement("td");
    latinCell.textContent = latinPhrases[randomIndex];

    const russianCell = document.createElement("td");
    russianCell.textContent = russianTranslations[randomIndex];

    row.appendChild(latinCell);
    row.appendChild(russianCell);
    phraseTableBody.appendChild(row);
  });

  // Перекрашивание четных строк
  repaintBtn.addEventListener("click", () => {
    const rows = phraseTableBody.querySelectorAll("tr");
    rows.forEach((row, index) => {
      if ((index + 1) % 2 === 0) {
        row.classList.add("bold-text");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const animals = document.querySelectorAll(".draggable");
    let draggedElement = null;
    let offsetX = 0; 
    let offsetY = 0; 

    animals.forEach((animal) => {
        const randomRotation = Math.floor(Math.random() * 360);
        animal.style.transform = `rotate(${randomRotation}deg)`;
        animal.dataset.rotation = randomRotation; 
    });

    animals.forEach((animal) => {
        animal.addEventListener("mousedown", (e) => {
            e.preventDefault(); 

            draggedElement = e.target;

            const rect = draggedElement.getBoundingClientRect();
            offsetX = e.clientX - rect.left; 
            offsetY = e.clientY - rect.top;

            draggedElement.style.position = "absolute";
            draggedElement.style.zIndex = "1000";
            document.body.appendChild(draggedElement); 

            const moveAt = (pageX, pageY) => {
                draggedElement.style.left = pageX - offsetX + "px";
                draggedElement.style.top = pageY - offsetY + "px";
            };

            moveAt(e.pageX, e.pageY); 

            const onMouseMove = (event) => {
                moveAt(event.pageX, event.pageY);
            };

            document.addEventListener("mousemove", onMouseMove);

            document.addEventListener(
                "mouseup",
                () => {
                    document.removeEventListener("mousemove", onMouseMove);
                    draggedElement.style.zIndex = "auto";
                    draggedElement = null;
                    checkCompletion();
                },
                { once: true }
            );
        });

        animal.ondragstart = () => false; 
    });

    // Проверка завершённости задания
    function checkCompletion() {
        const positions = {};
        const categories = ["mammal", "insect", "bird"];

        animals.forEach((animal) => {
            const category = animal.dataset.category;
            const rect = animal.getBoundingClientRect();
            positions[category] = positions[category] || [];
            positions[category].push(rect);
        });

        const allCorrect = categories.every((category) => {
            const group = positions[category];
            if (!group || group.length < 2) return false; 

            return group.every((rect, index, array) => {
                if (index === 0) return true; 
                const prevRect = array[index - 1];
                const distance = Math.sqrt(
                    Math.pow(rect.left - prevRect.left, 2) +
                    Math.pow(rect.top - prevRect.top, 2)
                );
                return distance < 150; 
            });
        });

        if (allCorrect) {
            animals.forEach((animal) => animal.classList.add("correct"));
            const instructions = document.querySelector(".instructions p");
        instructions.textContent = "Поздравляем! Все животные распределены правильно!";
        }
    }
});

