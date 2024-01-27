const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreElement = document.querySelector("#score");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackgroundColor = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x: unitSize * 4, y: 0},
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize, y: 0},
    {x: 0, y: 0}
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    if (!running) {
        running = true;
        score = 0;
        scoreElement.textContent = score;
        xVelocity = unitSize;
        yVelocity = 0;
        snake = [
            {x: unitSize * 4, y: 0},
            {x: unitSize * 3, y: 0},
            {x: unitSize * 2, y: 0},
            {x: unitSize, y: 0},
            {x: 0, y: 0}
        ];
        createFood();
        clearBoard();
        nextTicket();
    }
}

function nextTicket() {
    if (running) {
        moveSnake();
        clearBoard();
        drawSnake();
        drawFood();
        checkGameOver();
        setTimeout(nextTicket, 100);
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackgroundColor;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    foodX = Math.floor(Math.random() * (gameWidth / unitSize)) * unitSize;
    foodY = Math.floor(Math.random() * (gameHeight / unitSize)) * unitSize;
    for (let i = 0; i < snake.length; i++) {
        if (foodX === snake[i].x && foodY === snake[i].y) {
            createFood();
        }
    }
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);
    if (head.x === foodX && head.y === foodY) {
        score++;
        scoreElement.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? snakeColor : "darkgreen";
        ctx.fillRect(snake[i].x, snake[i].y, unitSize, unitSize);
        ctx.strokeStyle = snakeBorder;
        ctx.strokeRect(snake[i].x, snake[i].y, unitSize, unitSize);
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;
    const goingRight = xVelocity === unitSize;

    if (keyPressed === 37 && !goingRight) {
        xVelocity = -unitSize;
        yVelocity = 0;
    }

    if (keyPressed === 38 && !goingDown) {
        xVelocity = 0;
        yVelocity = -unitSize;
    }

    if (keyPressed === 39 && !goingLeft) {
        xVelocity = unitSize;
        yVelocity = 0;
    }

    if (keyPressed === 40 && !goingUp) {
        xVelocity = 0;
        yVelocity = unitSize;
    }
}

function checkGameOver() {
    if (
        snake[0].x < 0 ||
        snake[0].y < 0 ||
        snake[0].x >= gameWidth ||
        snake[0].y >= gameHeight ||
        collision()
    ) {
        displayGameOver();
    }
}

function collision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function displayGameOver() {
    running = false;
    alert("Game Over! Your score is " + score);
}

function resetGame() {
    running = false;
    gameStart();
}
