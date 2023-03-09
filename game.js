const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result')
const restartButton = document.querySelector('#restart-button');
const pauseButton = document.querySelector('#pause-button');

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

let paused = false;




const playerPosition = { x: undefined, y: undefined };
const astronautPosition = { x: undefined, y: undefined, };
let rockPosition = [];


window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function fixNumber(n) {
  return Number(n.toFixed(2));
}


function setCanvasSize() { //resize canvas
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }
  canvasSize = Number(canvasSize.toFixed(0));
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);
  elementSize = canvasSize / 10;
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function startGame() {
  pResult.innerHTML = '';
  console.log({ canvasSize, elementSize });
  game.font = elementSize + "px Verdana";
  game.textAlign = "end";
  const map = maps[level];   // split the elements in rows whitout spaces in 10 positions (step 6)
  if (!map) {
    gameWin();
    return;
  }
  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  const mapRows = map.trim().split("\n");
  const mapRowCols = mapRows.map(row => row.trim().split(""));
  showLives();
  rockPosition = [];
  game.clearRect(0, 0, canvasSize, canvasSize);   //delete the rocket old position (step 10)
  mapRowCols.forEach((row, rowI) => {   //print the elements (step 7)
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementSize * (colI + 1);
      const posY = elementSize * (rowI + 1);
      if (col === "O") {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      } else if (col === "I") {
        astronautPosition.x = posX;
        astronautPosition.y = posY;
      } else if (col === "X") {
        rockPosition.push({ x: posX, y: posY });
      }
      game.fillText(emoji, posX, posY);
    });
  });
  movePlayer();
}

function movePlayer() { //print the rocket (step 9) and catch de astronaut (step 12)
  const catchTheAstronautX =
    playerPosition.x.toFixed(3) === astronautPosition.x.toFixed(3);
  const catchTheAstronautY =
    playerPosition.y.toFixed(3) === astronautPosition.y.toFixed(3);
  const catchTheAstronaut =
    catchTheAstronautX && catchTheAstronautY;
  if (catchTheAstronaut) {
    levelWin();
  }

  const rockCollision = rockPosition.find((rock) => {
    const rockCollisionX = rock.x.toFixed(3) === playerPosition.x.toFixed(3);
    const rockCollisionY = rock.y.toFixed(3) === playerPosition.y.toFixed(3);
    return rockCollisionX && rockCollisionY;
  });

  if (rockCollision) {
    levelFail();
  }
  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

function levelWin() {
  level++;
  startGame();
}
function levelFail() {
  lives--;

  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() { // to refactor ( separar en dos funciones)
  console.log('you win');
  clearInterval(timeInterval);
  const recordTime = localStorage.getItem('record_time'); //(step 19)
  const playerTime = Date.now() - timeStart;
  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML = ('Superaste el record');
    } else {
      pResult.innerHTML = ('No superaste el record');
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = 'Primera vez? Intenta superar tu tiempo';
  }
  console.log(recordTime, playerTime);
}

function showLives() { //(step 16)
  const heartsArray = Array(lives).fill(emojis['HEART']);
  spanLives.innerHTML = '';
  heartsArray.forEach((heart) => spanLives.append(heart));
}

function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem('record_time');
}

// listen the keyboard
window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);




function moveByKeys(event) {
  if (event.key === 'ArrowUp') moveUp();
  else if (event.key === 'ArrowLeft') moveLeft();
  else if (event.key === 'ArrowRight') moveRight();
  else if (event.key === 'ArrowDown') moveDown();
}


function moveUp() { // move the rocket  and respect the canvas (step 11)
  if (playerPosition.y - elementSize < elementSize) {
    console.log('out');
  } else {
    playerPosition.y -= elementSize;
    startGame();
  }
}

function moveLeft() {
  if (playerPosition.x - elementSize < elementSize) {
    console.log('out');
  } else {
    playerPosition.x -= elementSize;
    startGame();
  }
};

function moveRight() {
  if (playerPosition.x + elementSize > canvasSize) {
    console.log('out');
  } else {
    playerPosition.x += elementSize;
    startGame();
  }
}

function moveDown() {
  if (playerPosition.y + elementSize > canvasSize) {
    console.log('out');
  } else {
    playerPosition.y += elementSize;
    startGame();
  }
}


restartButton.addEventListener('click', restartGame);
pauseButton.addEventListener('click', togglePause)

function restartGame() {
  level = 0;
  lives = 3;
  timeStart = undefined;
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function togglePause() {
  if (!paused) {
    paused = true;
    clearInterval(timeInterval);
    document.removeEventListener('keydown', movePlayer);
  } else {
    paused = false;
    timeInterval = setInterval(showTime, 100);
    document.addEventListener('keydown', movePlayer);
    movePlayer();
  }
}




