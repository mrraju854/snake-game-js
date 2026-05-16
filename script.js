const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

let box, snake, food, direction, game, score;
let speed = 120;

let highScore = localStorage.getItem("snakeHigh") || 0;
highScoreEl.innerText = highScore;

function resizeCanvas(){
  let size = Math.min(window.innerWidth - 40, 350);
  canvas.width = size;
  canvas.height = size;
  box = size / 20;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function startGame(){

  snake = [{x:10 * box, y:10 * box}];
  direction = "RIGHT";
  score = 0;
  speed = 120;

  scoreEl.innerText = score;

  food = randomFood();

  clearInterval(game);
  game = setInterval(draw, speed);
}

function randomFood(){
  return {
    x: Math.floor(Math.random()*20) * box,
    y: Math.floor(Math.random()*20) * box
  };
}

document.addEventListener("keydown", e => {
  if(e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if(e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if(e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if(e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function setDirection(dir){
  if(dir==="UP" && direction!=="DOWN") direction="UP";
  if(dir==="DOWN" && direction!=="UP") direction="DOWN";
  if(dir==="LEFT" && direction!=="RIGHT") direction="LEFT";
  if(dir==="RIGHT" && direction!=="LEFT") direction="RIGHT";
}

function draw(){

  ctx.fillStyle = "#020617";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  snake.forEach((part,i)=>{
    ctx.fillStyle = i === 0 ? "#22c55e" : "#16a34a";
    ctx.shadowColor = "#22c55e";
    ctx.shadowBlur = 10;
    ctx.fillRect(part.x, part.y, box, box);
  });

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x, food.y, box, box);

  let head = {...snake[0]};

  if(direction==="UP") head.y -= box;
  if(direction==="DOWN") head.y += box;
  if(direction==="LEFT") head.x -= box;
  if(direction==="RIGHT") head.x += box;

  if(
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(p => p.x === head.x && p.y === head.y)
  ){
    gameOver();
    return;
  }

  snake.unshift(head);

  if(head.x === food.x && head.y === food.y){
    score++;
    scoreEl.innerText = score;

    food = randomFood();

    if(speed > 60){
      speed -= 5;
      clearInterval(game);
      game = setInterval(draw, speed);
    }

  } else {
    snake.pop();
  }

}

function gameOver(){

  clearInterval(game);

  if(score > highScore){
    localStorage.setItem("snakeHigh", score);
    highScoreEl.innerText = score;
  }

  setTimeout(()=>{
    alert(`Game Over 😢\nScore: ${score}`);
  }, 100);
}