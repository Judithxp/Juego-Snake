const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Variables de estado
let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 1, dy = 0;
let score = 0, gameSpeed = 150;
let juegoActivo = false; 

// --- INICIALIZACIÓN ---
document.getElementById("boton-jugar").onclick = () => {
    document.getElementById("pantalla-inicio").style.display = "none";
    document.getElementById("juego-contenedor").style.display = "block";
    iniciarPartida();
};

document.getElementById("btn-reiniciar").onclick = () => iniciarPartida();
document.getElementById("btn-salir").onclick = () => {
    document.getElementById("juego-contenedor").style.display = "none";
    document.getElementById("controles-fin").style.display = "none";
    document.getElementById("pantalla-inicio").style.display = "flex";
};

function iniciarPartida() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dx = 1; dy = 0;
    score = 0;
    scoreElement.innerText = score;
    document.getElementById("controles-fin").style.display = "none";
    
    // 🟢 El juego se prepara, se dibuja, pero NO arranca hasta que des PLAY
    juegoActivo = false; 
    document.getElementById("btnPausa").innerText = "PLAY";
    
    generateFood();
    clearCanvas();
    drawFood();
    drawSnake();
}

function main() {
    if (!juegoActivo) return; 

    if (hasGameEnded()) {
        juegoActivo = false;
        document.getElementById("controles-fin").style.display = "block";
        document.getElementById("btnPausa").innerText = "PLAY";
        return;
    }

    clearCanvas();
    drawFood();
    drawSnake();

    setTimeout(() => {
        moveSnake();
        main();
    }, gameSpeed);
}

// --- BOTÓN PLAY/PAUSA ---
function alternarPausa() {
    if (!juegoActivo) {
        // Arrancamos el juego
        juegoActivo = true;
        document.getElementById("btnPausa").innerText = "PAUSA";
        main(); 
    } else {
        // Pausamos el juego
        juegoActivo = false;
        document.getElementById("btnPausa").innerText = "PLAY";
    }
}

// --- CONTROLES ---
document.addEventListener("keydown", changeDirection);
function changeDirection(event) {
    const k = event.keyCode;
    if (k === 37 && dx !== 1) { dx = -1; dy = 0; }
    if (k === 38 && dy !== 1) { dx = 0; dy = -1; }
    if (k === 39 && dx !== -1) { dx = 1; dy = 0; }
    if (k === 40 && dy !== -1) { dx = 0; dy = 1; }
}

const manejarControlMovil = (id, accion) => {
    document.getElementById(id).addEventListener("touchstart", (e) => {
        e.preventDefault();
        accion();
    });
};
manejarControlMovil("btnUp", () => { if (dy !== 1) { dx = 0; dy = -1; } });
manejarControlMovil("btnDown", () => { if (dy !== -1) { dx = 0; dy = 1; } });
manejarControlMovil("btnLeft", () => { if (dx !== 1) { dx = -1; dy = 0; } });
manejarControlMovil("btnRight", () => { if (dx !== -1) { dx = 1; dy = 0; } });

// --- LÓGICA DEL JUEGO ---
function clearCanvas() { ctx.fillStyle = "#252526"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
function drawSnake() { ctx.fillStyle = "#4ec9b0"; snake.forEach(p => ctx.fillRect(p.x * gridSize, p.y * gridSize, gridSize - 2, gridSize - 2)); }
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (snake[0].x === food.x && snake[0].y === food.y) { score += 10; scoreElement.innerText = score; generateFood(); }
    else snake.pop();
}
function drawFood() { ctx.fillStyle = "#f44747"; ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2); }
function generateFood() { food.x = Math.floor(Math.random() * tileCount); food.y = Math.floor(Math.random() * tileCount); }
function hasGameEnded() {
    if (snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount) return true;
    for (let i = 1; i < snake.length; i++) if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    return false;
}