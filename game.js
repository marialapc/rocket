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

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;


// (step9)
const playerPosition = {
  x: undefined,
  y: undefined,
  
};

//(step 12)
const astronautPosition = {
  x: undefined,
  y: undefined,
};

//(step13)
let rockPosition = [];

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
  //resize canvas

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
  // import elements

  game.font = elementSize + "px Verdana";
  game.textAlign = "end";

  // split the elements in rows whitout spaces in 10 positions (step 6)
  const map = maps[level];

  if (!map){
    gameWin();
    return;
  }

  if (!timeStart){
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));
  showLives();

  //  print the element (step 6)
  //    for (let row = 1; row <= 10; row++){
  //      for (let col = 1; col <= 10; col++){
  //       game.fillText(emojis[mapRowCols[row-1][col-1]],
  //       elementSize * col, elementSize * row);
  //     }
  //   }

  rockPosition = [];
  //delete the rocket old position (step 10)
  game.clearRect(0,0, canvasSize,canvasSize);
  //print the elements refactor (step 7)
  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementSize * (colI + 1);
      const posY = elementSize * (rowI + 1);

      if (col === 'O'){
      if (!playerPosition.x && !playerPosition.y)  {
      playerPosition.x = posX;
      playerPosition.y = posY;
      }
    } else if (col === 'I'){
      astronautPosition.x = posX;
      astronautPosition.y = posY;
    } else if (col == 'X'){
      rockPosition.push({
        x: posX,
        y: posY,
      });
    }

      game.fillText(emoji, posX, posY);
    });
  });

  movePlayer()
}

//print the rocket (step 9) and catch de astronaut (step 12)

function movePlayer(){
  const catchTheAstronautX = playerPosition.x.toFixed(3) === astronautPosition.x.toFixed(3);
  const catchTheAstronautY = playerPosition.y.toFixed(3) === astronautPosition.y.toFixed(3);
  const catchTheAstronaut = catchTheAstronautX && catchTheAstronautY;
  
 if (catchTheAstronaut){
  console.log('catch');
 levelWin();
  }
 
 // (step 13)
  const rockCollision = rockPosition.find(rock => {
    const rockCollisionX =  rock.x.toFixed(3) === playerPosition.x.toFixed(3);
    const rockCollisionY =  rock.y.toFixed(3) === playerPosition.y.toFixed(3);
    return rockCollisionX && rockCollisionY;
  });

  if (rockCollision){
   levelFail();
      }
     
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}
function levelWin(){
  console.log('subiste de nivel');
  level++;
  startGame();
}
function levelFail(){
  lives--;

  if (lives <= 0){
    level = 0; 
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
    startGame();
}
// to refactor ( separar en dos funciones)
function gameWin(){
  console.log('you win');
  clearInterval(timeInterval);
//(step 19)
  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;

    if (recordTime){
    if (recordTime >= playerTime){
      localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = ('superaste el record');
    } else {
    pResult.innerHTML = ('no superaste el record');
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = 'Primera vez? intenta superar tu tiempo';
  }


  console.log(recordTime, playerTime);
}
//(step 16)
function showLives(){
  const heartsArray = Array(lives).fill(emojis['HEART']);
  spanLives.innerHTML = '';
  heartsArray.forEach(heart => spanLives.append(heart));
 
}
function showTime(){
   spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord(){
  spanRecord.innerHTML = localStorage.getItem('record_time');
}


 // listen the keyboard(step 8)

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener ('click', moveUp);
btnLeft.addEventListener ('click', moveLeft);
btnRight.addEventListener ('click', moveRight);
btnDown.addEventListener ('click', moveDown);


function moveByKeys(event) {
 if ( event.key === 'ArrowUp') moveUp();
 else if (event.key == 'ArrowLeft') moveLeft();
 else if (event.key == 'ArrowRight') moveRight();
 else if (event.key == 'ArrowDown') moveDown();
 }

// move the rocket  and respect the canvas (step 11)

function moveUp() {
  if ((playerPosition.y - elementSize) < elementSize){
    console.log('out');
  }else {
  playerPosition.y -= elementSize;
  startGame();
  }
}

function moveLeft() {
 if( (playerPosition.x - elementSize) < elementSize){
  console.log('out');
 }else{
 playerPosition. x -= elementSize;
  startGame();
}
};

function moveRight() {
  if ((playerPosition.x + elementSize) > canvasSize){
    console.log('out');
    }else{
  playerPosition.x += elementSize;
    startGame();
    }
}

function moveDown() {
  if ((playerPosition.y+ elementSize) > canvasSize){
    console.log('out');
    }else{
  playerPosition.y += elementSize;
    startGame();
    }
}