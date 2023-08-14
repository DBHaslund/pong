const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const score = document.getElementById("score");
const header = document.querySelector("header");
const h1 = document.querySelector("h1");
const container = document.getElementById("pong-container");
const menuBtn = document.getElementById("pong-menu-button");
const pongMenu = document.getElementById("pong-menu");
const pongMainMenu = document.getElementById("pong-main-menu");
const pongKeybindMenu = document.getElementById("pong-keybind-menu");
const contBtn = document.getElementById("continue");
const newBtn = document.getElementById("start-new");
const keybindBtn = document.getElementById("keybindings");
const backBtn = document.getElementById("back");
const resetBtn = document.getElementById("reset");
const record = document.getElementById("record-key");
const menuNav = document.getElementById("menu-nav");

//---Set height and width of canvas
const width = (canvas.width = Math.floor((window.innerWidth - 26) / 10) * 10);
const height = (canvas.height =
  width / 2 < window.innerHeight
    ? width / 2 - 100
    : window.innerHeight / 1.5);
document.getElementById("pong-container").style.width = width + "px";

//---Initialisation of various variables
let playerWidth = width * 0.01;
let playerHeight = width * 0.1;
let x;
let y;
let velX;
let velY;
let size;
let paused = true;
let playerOneScore = 0;
let playerTwoScore = 0;

//---Keybindings

let p1UpInput = document.getElementById("p1-up");
let p1DownInput = document.getElementById("p1-down");
let p2UpInput = document.getElementById("p2-up");
let p2DownInput = document.getElementById("p2-down");

document.addEventListener("click", (e) => {
  if (e.target.tagName == "INPUT" && e.target.className == "keybind-menu") {
    record.style.display = "flex";
    e.target.value = "";
  }
});

p1UpInput.addEventListener("keydown", (e) => {
  record.style.display = "none";
  localStorage.setItem("p1Up", e.key);
  playerOneUp = localStorage.getItem("p1Up");
});

p1UpInput.addEventListener("blur", () => {
  if (p1UpInput.value === "") {
    setTimeout(function () {
      p1UpInput.focus();
    }, 1);
  }
});

p1DownInput.addEventListener("keydown", (e) => {
  record.style.display = "none";
  localStorage.setItem("p1Down", e.key);
  playerOneDown = localStorage.getItem("p1Down");
});

p1DownInput.addEventListener("blur", () => {
  if (p1DownInput.value === "") {
    setTimeout(function () {
      p1DownInput.focus();
    }, 1);
  }
});

p2UpInput.addEventListener("keydown", (e) => {
  record.style.display = "none";
  localStorage.setItem("p2Up", e.key);
  playerTwoUp = localStorage.getItem("p2Up");
});

p2UpInput.addEventListener("blur", () => {
  if (p2UpInput.value === "") {
    setTimeout(function () {
      p2UpInput.focus();
    }, 1);
  }
});

p2DownInput.addEventListener("keydown", (e) => {
  record.style.display = "none";
  localStorage.setItem("p2Down", e.key);
  playerTwoDown = localStorage.getItem("p2Down");
});

p2DownInput.addEventListener("blur", () => {
  if (p2DownInput.value === "") {
    setTimeout(function () {
      p2DownInput.focus();
    }, 1);
  }
});

localStorage.setItem("p1Up", "w");
localStorage.setItem("p1Down", "s");
localStorage.setItem("p2Up", "ArrowUp");
localStorage.setItem("p2Down", "ArrowDown");

let playerOneUp = localStorage.getItem("p1Up");
let playerOneDown = localStorage.getItem("p1Down");
let playerTwoUp = localStorage.getItem("p2Up");
let playerTwoDown = localStorage.getItem("p2Down");

p1UpInput.value = playerOneUp;
p1DownInput.value = playerOneDown;
p2UpInput.value = playerTwoUp;
p2DownInput.value = playerTwoDown;

let keysPressed = {
  playerOneUp: false,
  playerOneDown: false,
  playerTwoUp: false,
  playerTwoDown: false,
};
// ---------------------------------

function randomNumber(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function togglePause() {
  if (!paused) {
    paused = true;
  } else if (paused) {
    paused = false;
  }
}

//---Menu button
menuBtn.addEventListener("click", () => {
  if (pongMenu.style.display === "inline") {
    pongMenu.style.display = "none";
    paused = false;
  } else {
    pongMenu.style.display = "inline";
    paused = true;
  }

  if (playerOneScore === 0 && playerTwoScore === 0) {
    contBtn.style.display = "none";
  } else {
    contBtn.style.display = "inline";
  }
});

//---Continue button
contBtn.addEventListener("click", () => {
  pongMenu.style.display = "none";
  contBtn.style.display = "none";
  paused = false;
});

//---Keybindings button
keybindBtn.addEventListener("click", () => {
  pongMainMenu.style.display = "none";
  pongKeybindMenu.style.display = "grid";
  menuNav.style.display = "inline";
});

//---Back button
backBtn.addEventListener("click", () => {
  pongMainMenu.style.display = "flex";
  pongKeybindMenu.style.display = "none";
  menuNav.style.display = "none";
});

//---Reset keybindings button
resetBtn.addEventListener("click", () => {
  localStorage.setItem("p1Up", "w");
  p1UpInput.value = playerOneUp = localStorage.getItem("p1Up");

  localStorage.setItem("p1Down", "s");
  p1DownInput.value = playerOneDown = localStorage.getItem("p1Down");

  localStorage.setItem("p2Up", "ArrowUp");
  p2UpInput.value = playerTwoUp = localStorage.getItem("p2Up");

  localStorage.setItem("p2Down", "ArrowDown");
  p2DownInput.value = playerTwoDown = localStorage.getItem("p2Down");
});

//---New game button - resets canvas, ball position and score
newBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, width, height);
  playerOneScore = 0;
  playerTwoScore = 0;
  pongMenu.style.display = "none";
  paused = false;
  ball.x = width / 2;
  ball.y = height / 2;
  p1.y = (height / 100) * 50 - playerHeight / 2;
  p2.y = (height / 100) * 50 - playerHeight / 2;
});

//---Player class definitions
class Player {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;

    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "#FFF";
    ctx.fillRect(this.x, this.y, playerWidth, playerHeight);
  }

  checkBounds() {
    if (this.y + playerHeight >= height) {
      this.y = height - playerHeight;
    }

    if (this.y <= 0) {
      this.y = 0;
    }
  }
}

class PlayerOne extends Player {
  constructor(x, y) {
    super(x, y);
    velY = 20;
    this.x = x = 50;
    this.y = y = (height / 100) * 50 - playerHeight / 2;

    document.addEventListener("keydown", (e) => {
      keysPressed[e.key] = true;
      if (!paused) {
        if (keysPressed[playerOneUp]) {
          this.y -= velY;
        }
        if (keysPressed[playerOneDown]) {
          this.y += velY;
        }
      }
    });

    document.addEventListener("keyup", (e) => {
      keysPressed[e.key] = false;
    });
  }
}

class PlayerTwo extends Player {
  constructor() {
    super(x, y);
    velY = 20;
    this.x = width - playerWidth - 50;
    this.y = (height / 100) * 50 - playerHeight / 2;

    document.addEventListener("keydown", (e) => {
      keysPressed[e.key] = true;
      if (!paused) {
        if (keysPressed[playerTwoUp]) {
          this.y -= velY;
        }
        if (keysPressed[playerTwoDown]) {
          this.y += velY;
        }
      }
    });

    document.addEventListener("keyup", (e) => {
      keysPressed[e.key] = false;
    });
  }
}

//---Ball definitions
class Ball {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.velX = width * 0.005;
    this.velY = height * 0.015;
    this.size = playerWidth;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "#FFF";
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      playerOneScore += 1;
      this.x = width / 2;
      this.y = height / 2;
    }

    if (this.x - this.size <= 0) {
      playerTwoScore += 1;
      this.x = width / 2;
      this.y = height / 2;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    let bx1 = this.x - this.size / 2;
    let bx2 = this.x + this.size / 2;
    let by = this.y + this.size / 2;

    // Ball hitting front of p1
    if (
      bx1 <= p1.x + playerWidth &&
      bx1 >= p1.x &&
      by >= p1.y &&
      by <= p1.y + playerHeight
    ) {
      this.velX = -this.velX;
      this.velY = +this.velY;
    }

    // Ball hitting front of p2
    if (
      bx2 >= p2.x &&
      bx2 <= p2.x + playerWidth &&
      by >= p2.y &&
      by <= p2.y + playerHeight
    ) {
      this.velX = -this.velX;
      this.velY = +this.velY;
    }
  }
}

//---Initialising 2 players and the ball
const p1 = new PlayerOne();
const p2 = new PlayerTwo();
const ball = new Ball();

//---Game loop
function loop() {
  // if (playerOneScore === 0 && playerTwoScore === 0) {
  //     contBtn.style.display = 'none';
  // }

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, width, height);

  if (!paused) {
    ball.update();
  }

  p1.draw();
  p1.checkBounds();

  p2.draw();
  p2.checkBounds();

  ball.draw();
  ball.collisionDetect();

  score.textContent = `Score: ${playerOneScore} - ${playerTwoScore}`;

  requestAnimationFrame(loop);
}

loop();

// For testing/illustration purposes

// canvas.addEventListener('mousemove', (e) => {
//     const x = e.offsetX;
//     const y = e.offsetY;
//     console.log(x, y);
// });
