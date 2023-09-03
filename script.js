const WIDTH = 360;
const HEIGHT = 640;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const BIRD_IMAGE = new Image();
const birdX = WIDTH / 8;
let birdY = HEIGHT / 2;

let pipeArray = [];
const PIPE_WIDTH = 64;
const PIPE_HEIGHT = 512;
let pipeX = WIDTH;
let pipeY = 0;
const PIPE_TIME = 1500;
const TOP_PIPE_IMG = new Image();
const BOTTOM_PIPE_IMG = new Image();
const PIPE_SPACE = HEIGHT / 4;

const velocityX = -3;
let velocityY = 0;
const GRAVITY = 0.4;
let gameOver = false;
let score = 0;

const bird = {
  x: birdX,
  y: birdY,
  width: BIRD_WIDTH,
  height: BIRD_HEIGHT,
};

document.addEventListener("keydown", moveBird);

window.addEventListener("load", function () {
  canvas.height = HEIGHT;
  canvas.width = WIDTH;

  BIRD_IMAGE.src = "./assets/flappybird.png";
  TOP_PIPE_IMG.src = "./assets/toppipe.png";
  BOTTOM_PIPE_IMG.src = "./assets/bottompipe.png";
  BIRD_IMAGE.addEventListener("load", drawBird);

  requestAnimationFrame(update);
  setInterval(placePipes, PIPE_TIME);
});

function drawBird() {
  bird.y = Math.max(bird.y + velocityY, 0);
  ctx.drawImage(BIRD_IMAGE, bird.x, bird.y, bird.width, bird.height);
}

function placePipes() {
  if (gameOver) return;

  const randomPipeY =
    pipeY - PIPE_HEIGHT / 4 - (Math.random() * PIPE_HEIGHT) / 2;

  const topPipe = {
    img: TOP_PIPE_IMG,
    x: pipeX,
    y: randomPipeY,
    width: PIPE_WIDTH,
    height: PIPE_HEIGHT,
    passed: false,
  };

  const bottomPipe = {
    img: BOTTOM_PIPE_IMG,
    x: pipeX,
    y: topPipe.height + topPipe.y + PIPE_SPACE,
    width: PIPE_WIDTH,
    height: PIPE_HEIGHT,
    passed: false,
  };
  pipeArray.push(topPipe, bottomPipe);
}

function drawPipes() {
  pipeArray.forEach((pipe) => {
    pipe.x += velocityX;
    ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }
  });
}

while (pipeArray.length > 0 && pipeArray[0].x < -PIPE_WIDTH) {
  pipeArray.shift();
}
function update() {
  requestAnimationFrame(update);
  if (gameOver) return;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  velocityY += GRAVITY;
  drawBird();
  drawPipes();

  if (bird.y > HEIGHT) gameOver = true;

  ctx.fillStyle = "white";
  ctx.font = "45px sans-serif";
  ctx.fillText(score, 10, 50);
}

function moveBird(e) {
  if (e.code !== "Space" && e.code !== "ArrowUp") return;

  velocityY = -6;

  if (gameOver) {
    resetGame();
  }
}

function detectCollision(bird, pipe) {
  return (
    bird.x < pipe.x + pipe.width &&
    bird.x + bird.width > pipe.x &&
    bird.y < pipe.y + pipe.height &&
    bird.y + bird.height > pipe.y
  );
}

function resetGame() {
  bird.y = birdY;
  pipeArray = [];
  score = 0;
  gameOver = false;
}
