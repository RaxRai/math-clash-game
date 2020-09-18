let gridSize = 6;
let grid = [[], [], [], [], [], []];
let gridSelect = [[], [], [], [], [], []];
let bottomInner = document.getElementById("bottom-section");
let startGameInner = document.getElementById("startGame");
let secondInner = document.getElementById("second");
let scoreInner = document.getElementById("score");
let gameOver = false;
let speed = 0;
let selectedSum = 0;
let targetSum = 0;
let score = 0;

let highInner = document.getElementById("highscore");
let highLocal = localStorage.getItem("highscore");

// IIFE load highscore
(function () {
  if (highLocal === null) {
    highInner.innerText = "You Have Not Attempted";
  } else {
    highInner.innerText = `Highscore : ${highLocal}`;
  }
  //console.log(highLocal);
})();

const hideHighShowScore = () => {
  highInner.classList.add("hide");
  scoreInner.classList.remove("hide");
};

// change target number
const changeNumber = () => {
  targetSum = 10 + Math.floor(Math.random() * 50);
  let firstInner = document.getElementById("first");
  firstInner.innerText = targetSum;
  secondInner.innerText = 0;
};
// deselect selected cell if current sum is higher than target
const clearSelected = () => {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      gridSelect[i][j] = "false";
    }
  }
};
// delete selected cell if current sum is equal to the target
const deleteSelected = () => {
  let currScore = 0;
  for (let i = grid.length - 1; i >= 0; i--) {
    for (let j = grid[i].length; j >= 0; j--) {
      if (gridSelect[i][j] === "true") {
        currScore++;
        console.log("deleting" + grid[i][j]);
        grid[i].splice(j, 1);
        gridSelect[i][j] = "false";
      }
    }
  }
  return currScore;
};

// handle click on every cell and check if target achived or not
const handleClick = (el, i, j) => {
  if (gameOver) {
    return;
  }
  if (grid[i][j] === undefined) {
    //console.log("clicked on undef");
    grid[i].pop();
    return;
  }
  //console.log("clicked" + grid[i][j]);
  let theGridID = i + "" + j;
  if (gridSelect[i][j] === "true") {
    selectedSum -= grid[i][j];
    gridSelect[i][j] = "false";
  } else {
    gridSelect[i][j] = "true";
    selectedSum += grid[i][j];
  }

  if (selectedSum > targetSum) {
    selectedSum = 0;
    //console.log("you exceeded the current target");
    clearSelected();
    updateBoard();
  } else if (selectedSum === targetSum) {
    selectedSum = 0;
    score += deleteSelected();
    clearSelected();
    updateBoard();
    changeNumber();
    //console.log("target achieved");
  }
  updateBoard();
};

const getId = (i, j) => {
  return i.toString() + j.toString();
};

// add random numbers to 0th index of each array
const addRow = () => {
  if (gameOver) {
    return;
  }
  for (let i = 0; i < gridSize; i++) {
    let randomNum = Math.ceil(Math.random() * 9);
    grid[i].unshift(randomNum);
    gridSelect[i].unshift("false");
  }
};
// check if game over
const isGameOver = () => {
  for (let i = 0; i < gridSize; i++) {
    if (grid[i].length > gridSize) {
      gameOver = true;
      return true;
    }
  }
  return false;
};
// set or update highScore in local storage
const updateScore = () => {
  scoreInner.innerText = `Score : ${score}`;
  if (highLocal === null) {
    localStorage.setItem("highscore", score);
  } else if (score > highLocal) {
    localStorage.setItem("highscore", score);
  }
};

// upadate board function
const updateBoard = () => {
  if (isGameOver()) {
    let gameContainerInner = document.getElementById("gameContainer");
    gameContainerInner.classList.add("hide");
    let restartInner = document.getElementById("restart");
    restartInner.classList.remove("hide");
    restartInner.addEventListener("click", () => {
      document.location.reload();
    });
    //alert("gameover");
    return;
  }
  updateScore();
  //scoreInner.innerText = `Score : ${score}`;
  //console.log(grid.toString);
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const el = document.getElementById(getId(i, j));
      if (typeof grid[i][j] === "undefined") {
        el.innerHTML = "";
        el.classList.remove("bg-white");
      } else {
        el.innerHTML = grid[i][j];
        el.classList.add("bg-white");
      }

      if (gridSelect[i][j] === "true") {
        el.classList.add("bg");
      } else {
        el.classList.remove("bg");
      }
    }
    secondInner.innerText = selectedSum;
  }
};

const setDifficulty = () => {
  let diffValue = document.getElementById("difficulty").value;

  if (diffValue === "easy") {
    speed = 7000;
  } else if (diffValue === "medium") {
    speed = 5000;
  } else if (diffValue === "hard") {
    speed = 3000;
  }
  console.log(diffValue);
};
// start game and render grid, update HUD etc
const startGame = () => {
  startGameInner.classList.add("hide");
  let gameContainer = document.createElement("div");
  gameContainer.classList.add("gameContainer");
  gameContainer.id = "gameContainer";
  for (let i = 0; i < gridSize; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < gridSize; j++) {
      let col = document.createElement("div");
      col.className = "cell";
      col.id = i + "" + j;
      col.addEventListener("click", () => handleClick(col, i, j));
      row.appendChild(col);
    }
    gameContainer.appendChild(row);
  }
  bottomInner.appendChild(gameContainer);
  setDifficulty();
  changeNumber();
  addRow();
  updateBoard();
  startInterval();
  hideHighShowScore();
  //console.log(grid);
};
// interval function
const startInterval = () => {
  let interValId = setInterval(function () {
    if (gameOver) {
      clearInterval(interValId);
      return;
    }
    addRow();
    updateBoard();
  }, speed);
};

startGameInner.addEventListener("click", startGame);
