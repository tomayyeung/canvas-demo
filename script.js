"use strict";
// set up canvas & context
let c = document.getElementById("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
let ctx = c.getContext("2d");
ctx.strokeStyle = "rgb(0 0 0)"; // only time we stroke it's black (square border & world border)
const frameWidth = 1500;
const frameHeight = 800;
const worldWidth = 4500;
const worldHeight = 2500;
let circles = new Set();
const squareSize = 50;
const moveSpeed = 2;
class Frame {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
    }
}
class Circle {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    display(frame) {
        // only display if it will be visible in frame
        if (this.x + this.size < frame.x) { // left
            return;
        }
        if (this.x - this.size > frame.x + frameWidth) { // right
            return;
        }
        if (this.y + this.size < frame.y) { // up
            return;
        }
        if (this.y - this.size > frame.y + frameHeight) { // down
            return;
        }
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x - frame.x, this.y - frame.y, this.size, 0, Math.PI * 2, false);
        ctx.fill();
    }
}
class Square {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    detectContact(circle) {
        // get x/y distance
        let distX = Math.abs(this.x + this.size / 2 - circle.x);
        let distY = Math.abs(this.y + this.size / 2 - circle.y);
        // if distance is too large, there is no collision
        if (distX > this.size / 2 + circle.size)
            return false;
        if (distY > this.size / 2 + circle.size)
            return false;
        // if distances is close enough, there is collision
        if (distX <= this.size / 2)
            return true;
        if (distY <= this.size / 2)
            return true;
        // check corner
        let cornerDistance_sq = Math.pow(distX - this.size / 2, 2) + Math.pow(distY - this.size / 2, 2);
        return cornerDistance_sq <= circle.size * circle.size;
    }
    draw(frame) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - frame.x, this.y - frame.y, squareSize, squareSize);
        ctx.strokeRect(this.x - frame.x, this.y - frame.y, squareSize, squareSize);
    }
}
let square = new Square(0, 0, squareSize, "rgb(255, 255, 255)");
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
let movingLeft = false;
let movingRight = false;
let movingUp = false;
let movingDown = false;
function keyDownHandler(event) {
    switch (event.code) {
        case "ArrowLeft":
            movingLeft = true;
            break;
        case "ArrowRight":
            movingRight = true;
            break;
        case "ArrowUp":
            movingUp = true;
            break;
        case "ArrowDown":
            movingDown = true;
            break;
    }
}
function keyUpHandler(event) {
    switch (event.code) {
        case "ArrowLeft":
            movingLeft = false;
            break;
        case "ArrowRight":
            movingRight = false;
            break;
        case "ArrowUp":
            movingUp = false;
            break;
        case "ArrowDown":
            movingDown = false;
            break;
    }
}
function move(square) {
    if (movingLeft && square.x > -worldWidth / 2) {
        square.x -= moveSpeed;
    }
    else if (movingRight && square.x + squareSize < worldWidth / 2) {
        square.x += moveSpeed;
    }
    if (movingUp && square.y > -worldHeight / 2) {
        square.y -= moveSpeed;
    }
    else if (movingDown && square.y + squareSize < worldHeight / 2) {
        square.y += moveSpeed;
    }
}
function run(frame) {
    // move square based on keyboard input
    move(square);
    // update frame based on square
    frame.x = square.x + squareSize / 2 - frameWidth / 2;
    frame.y = square.y + squareSize / 2 - frameHeight / 2;
    // display ----
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeRect(-worldWidth / 2 - frame.x, -worldHeight / 2 - frame.y, worldWidth, worldHeight); // draw border
    // display each circle
    for (let circle of circles) {
        circle.display(frame);
        if (square.detectContact(circle)) {
            square.color = circle.color;
        }
    }
    square.draw(frame);
    window.requestAnimationFrame(() => (run(frame)));
}
function start() {
    let frame = new Frame(frameWidth, frameHeight);
    // create circles with random x, y, size, color 
    let numCircles = 50;
    for (let i = 0; i < numCircles; i++) {
        let x = Math.random() * worldWidth - 0.5 * worldWidth;
        let y = Math.random() * worldHeight - 0.5 * worldHeight;
        let size = Math.random() * 40 + 10;
        let color = `rgb(${Math.random() * 255} ${Math.random() * 255} ${Math.random() * 255})`;
        circles.add(new Circle(x, y, size, color));
    }
    run(frame);
}
window.onload = start;
