const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const gridSize = 20; // Tamaño de cada cuadrícula (20x20 píxeles)
const tileCount = canvas.width / gridSize;

// Inicializar la serpiente
let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];

// Comida
let food = { x: 5, y: 5 };

// Dirección inicial
let dx = 1;
let dy = 0;

let score = 0;
let gameSpeed = 150; 
let juegoPausado = true; // El juego empieza congelado
let gameTimeout; // Variable para controlar el temporizador único

// --- BUCLE PRINCIPAL (Corregido para evitar duplicación de bucles) ---
function main() {
    if (hasGameEnded()) {
        alert(`Juego Terminado. Tu puntuación fue: ${score}`);
        resetGame();
        return;
    }

    // Dibujar siempre el estado actual en pantalla
    clearCanvas();
    drawFood();
    drawSnake();

    // Limpiamos cualquier temporizador anterior por seguridad
    clearTimeout(gameTimeout);

    // Si está pausado, detenemos el avance pero mantenemos el dibujo estable
    if (juegoPausado) {
        return; 
    }

    // Un único temporizador que mueve la serpiente y repite el ciclo
    gameTimeout = setTimeout(() => {
        moveSnake();
        main(); 
    }, gameSpeed);
}

// Inicializar comida y pintar el estado inicial quieto
generateFood();
main();

// --- CONTROLES PARA ORDENADOR (TECLADO) ---
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    // Evita que la serpiente se suicide girando sobre sí misma de golpe
    if (keyPressed === LEFT_KEY && dx !== 1) { dx = -1; dy = 0; }
    if (keyPressed === UP_KEY && dy !== 1) { dx = 0; dy = -1; }
    if (keyPressed === RIGHT_KEY && dx !== -1) { dx = 1; dy = 0; }
    if (keyPressed === DOWN_KEY && dy !== -1) { dx = 0; dy = 1; }
}

// --- CONTROLES PARA MÓVIL (Cambiados a 'touchstart' para respuesta instantánea) ---
const manejarControlMovil = (id, accion) => {
    document.getElementById(id).addEventListener("touchstart", (e) => {
        e.preventDefault(); // Evita comportamientos raros del navegador móvil
        accion();
    });
};

manejarControlMovil("btnUp", () => { if (dy !== 1) { dx = 0; dy = -1; } });
manejarControlMovil("btnDown", () => { if (dy !== -1) { dx = 0; dy = 1; } });
manejarControlMovil("btnLeft", () => { if (dx !== 1) { dx = -1; dy = 0; } });
manejarControlMovil("btnRight", () => { if (dx !== -1) { dx = 1; dy = 0; } });


// Evitar que la pantalla rebote o se mueva al jugar en el móvil
document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// --- LÓGICA GENERAL DEL JUEGO ---

function clearCanvas() {
    ctx.fillStyle = "#252526";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = "#4ec9b0"; 
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); 

    const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
    if (hasEatenFood) {
        score += 10;
        scoreElement.innerText = score;
        generateFood();
    } else {
        snake.pop(); 
    }
}

function drawFood() {
    ctx.fillStyle = "#f44747"; // Rojo manzana de VS Code
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    
    // Validar que la comida no aparezca encima de la serpiente
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
            generateFood();
            break;
        }
    }
}

function hasGameEnded() {
    // Choque con las paredes
    if (snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount) {
        return true;
    }

    // Choque consigo misma
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dx = 1; dy = 0;
    score = 0;
    scoreElement.innerText = score;
    juegoPausado = true;
    
    const boton = document.getElementById("btnPausa");
    boton.innerText = "PLAY";

    generateFood();
    main();
}

function alternarPausa() {
    juegoPausado = !juegoPausado; 
    const boton = document.getElementById("btnPausa");
    
    if (juegoPausado) {
        boton.innerText = "PLAY";
    } else {
        boton.innerText = "PAUSA";
        main(); // Reanudamos el bucle al quitar la pausa
    }
}