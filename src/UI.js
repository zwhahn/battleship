import { Gameboard, Player, Ship } from "./battleship.js";
import { Gameplay } from "./battleship.js";

let player1 = new Player();
let player2 = new Player();
let game = new Gameplay(player1, player2);

const playerBoards = document.getElementsByClassName("board-container");
const playerOneBoard = playerBoards[0];
const playerTwoBoard = playerBoards[1];

const randomFleetBtn = document.querySelector("#random-fleet-btn");
randomFleetBtn.addEventListener("click", () => {
	player1.board = new Gameboard();
	player2.board = new Gameboard();
	game.placeShipsRandomly(player1);
	game.placeShipsRandomly(player2);
	drawPlayer1Board();
	removeAllFromShipyard();
	drawPlayer2Board();
});

const resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click", () => {
	player1 = new Player();
	player2 = new Player();
	game = new Gameplay(player1, player2);
	drawPlayer1Board();
	game.placeShipsRandomly(null, player2);
	drawPlayer2Board();
	drawShipyard();
	togglePlayer2Board();
});

const newGameBtn = document.querySelector("#new-game-btn");
newGameBtn.addEventListener("click", () => {
	newGame();
});

let recentPlacedShip = null;
let recentX = null;
let recentY = null;

function newGame() {
	player1 = new Player();
	player2 = new Player();
	game = new Gameplay(player1, player2);
	drawPlayer1Board();
	game.placeShipsRandomly(null, player2);
	drawPlayer2Board();
	drawShipyard();
	togglePlayer2Board();
	const gameOverScreen = document.querySelector(".game-over-screen");
	gameOverScreen.classList.remove("show");
	gameOverScreen.style.pointerEvents = "none";
}

newGame();

function drawShipyard() {
	removeAllFromShipyard();
	const ships = [
		{ name: "carrier", size: 5, horizontal: true, position: null },
		{ name: "battleship", size: 4, horizontal: true, position: null },
		{ name: "cruiser", size: 3, horizontal: true, position: null },
		{ name: "submarine", size: 3, horizontal: true, position: null },
		{ name: "destroyer", size: 2, horizontal: true, position: null },
	];
	ships.forEach((ship) => {
		const shipDiv = document.createElement("div");

		shipDiv.classList.add("ship-piece");
		shipDiv.draggable = true;
		shipDiv.dataset.name = ship.name;
		shipDiv.dataset.size = ship.size;
		shipDiv.dataset.horizontal = ship.horizontal;

		const shipSlot = document.getElementById(`${ship.name}`);
		shipSlot.appendChild(shipDiv);

		shipDiv.addEventListener("dragstart", (e) => {
			e.dataTransfer.setData("size", shipDiv.dataset.size);
			e.dataTransfer.setData("name", shipDiv.dataset.name);
			e.dataTransfer.setData("horizontal", shipDiv.dataset.horizontal);
		});

		for (let i = 0; i < ship.size; i++) {
			const cell = document.createElement("div");
			cell.classList.add("cell");
			shipDiv.appendChild(cell);
		}
	});
}

document.addEventListener("keydown", (e) => {
	if (!recentPlacedShip) {
		return;
	}

	if (e.code === "Space") {
		console.log("rotate: ", recentPlacedShip);
		e.preventDefault();
		removeShipFromBoard(recentPlacedShip);
		recentPlacedShip.horizontal = !recentPlacedShip.horizontal;

		const placed = player1.board.place(recentPlacedShip, [
			recentY,
			recentX,
		]);

		if (!placed) {
			recentPlacedShip.horizontal = !recentPlacedShip.horizontal;
			player1.board.place(recentPlacedShip, [recentY, recentX]);
		}

		drawPlayer1Board();
	}
	console.log("keypress");
});

function removeOneFromShipyard(shipName) {
	const shipSlot = document.getElementById(`${shipName}`);
	shipSlot.innerHTML = "";
}

function removeAllFromShipyard() {
	const shipSlots = document.getElementsByClassName("ship-slot");
	for (const slot of shipSlots) {
		slot.innerHTML = "";
	}
	togglePlayer2Board();
}

function togglePlayer2Board() {
	const blocker = document.querySelector(".blocker");
	// const player1Cells = document.querySelector("#player1-boards").childNodes();

	if (!isShipyardEmpty()) {
		blocker.style.zIndex = 100;
	} else {
		blocker.style.zIndex = 0;
	}
}

function isShipyardEmpty() {
	const shipSlots = document.getElementsByClassName("ship-slot");
	for (const slot of shipSlots) {
		if (slot.innerHTML !== "") {
			return false;
		}
	}
	return true;
}

// Player 1's Board
function drawPlayer1Board() {
	playerOneBoard.innerHTML = "";

	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			const cell = document.createElement("div");
			if (player1.board.gameboard[y][x] !== 0) {
				cell.classList.add("ship");

				const ship = player1.board.gameboard[y][x];
				const [originY, originX] = findShipOrigin(ship);

				cell.draggable = true;

				cell.addEventListener("dragstart", (e) => {
					e.dataTransfer.setData("moving", "true");
					e.dataTransfer.setData("originY", originY);
					e.dataTransfer.setData("originX", originX);
				});
			}

			console.log("recentPlacedShip:", recentPlacedShip);
			if (player1.board.gameboard[y][x] === recentPlacedShip) {
				cell.classList.add("recent-ship");
			}

			cell.classList.add("player1-cell", "cell");
			playerOneBoard.appendChild(cell);

			cell.dataset.y = y;
			cell.dataset.x = x;

			cell.addEventListener("dragover", (e) => {
				e.preventDefault();
			});

			cell.addEventListener("drop", (e) => {
				const moving = e.dataTransfer.getData("moving");

				// Ship has already been placed
				if (moving === "true") {
					console.log("exisiting ship");

					const originY = parseInt(e.dataTransfer.getData("originY"));
					const originX = parseInt(e.dataTransfer.getData("originX"));
					const ship = player1.board.gameboard[originY][originX];

					removeShipFromBoard(ship);

					const placed = player1.board.place(ship, [y, x]);

					if (!placed) {
						player1.board.place(ship, [originY, originX]);
					}

					recentPlacedShip = ship;
					recentX = x;
					recentY = y;
					drawPlayer1Board();
					return;
				}

				const shipSize = parseInt(e.dataTransfer.getData("size"));
				const shipName = e.dataTransfer.getData("name");
				const shipHorizontal = e.dataTransfer.getData("horizontal");
				console.log("dropped");

				const placed = placeShipOnBoard(
					shipSize,
					[y, x],
					shipHorizontal,
				);

				console.log("placed: ", placed);
				if (placed) {
					removeOneFromShipyard(shipName);
				}

				togglePlayer2Board();
			});
		}
	}
}

function placeShipOnBoard(size, [y, x], horizontal) {
	const horizontalBool = horizontal === "true";
	const ship = new Ship(size, 0, false, horizontalBool);
	recentPlacedShip = ship;
	recentX = x;
	recentY = y;

	console.log(ship);

	const placed = player1.board.place(ship, [y, x]);

	if (placed) {
		console.log("placed: ", player1.board.gameboard[y][x]);
		drawPlayer1Board();
		return true;
	}
	return false;
}

function removeShipFromBoard(ship) {
	console.log("trying to remove ship: ", ship);
	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			console.log(player1.board.gameboard[y][x]);
			if (player1.board.gameboard[y][x] === ship) {
				console.log("found ship");
				player1.board.gameboard[y][x] = 0;
			}
		}
	}
}

// Player 2's Board
function drawPlayer2Board() {
	playerTwoBoard.innerHTML = "";

	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			const cell = document.createElement("div");

			// View CPU ships
			if (player2.board.gameboard[y][x] !== 0) {
				cell.classList.add("ship");
			}

			cell.classList.add("cell");
			playerTwoBoard.appendChild(cell);

			cell.dataset.y = y;
			cell.dataset.x = x;

			cell.addEventListener("click", (e) => {
				const cx = e.target.dataset.x;
				const cy = e.target.dataset.y;

				game.handlePlayerMove(cy, cx);
				updateCellColor(playerTwoBoard, cy, cx, player2.board);
				for (let child of document.querySelector("#player1-board")
					.childNodes) {
					child.classList.add("game-active");
					child.classList.remove("recent-ship");
				}
				if (player2.board.allSunk()) {
					const gameOverScreen =
						document.querySelector(".game-over-screen");
					gameOverScreen.classList.toggle("show");
					gameOverScreen.style.pointerEvents = "auto";

					const gameOverText =
						document.querySelector(".game-over-text");
					gameOverText.textContent = "You Won!";
				}
				computerMove();
				if (player1.board.allSunk()) {
					const gameOverScreen =
						document.querySelector(".game-over-screen");
					gameOverScreen.classList.toggle("show");
					gameOverScreen.style.pointerEvents = "auto";

					const gameOverText =
						document.querySelector(".game-over-text");
					gameOverText.textContent = "CPU Won!";
				}
			});
		}
	}
}

function updateCellColor(boardElement, y, x, playerBoard) {
	const cell = boardElement.querySelector(
		`.cell[data-y="${y}"][data-x="${x}"]`,
	);

	if (playerBoard.gameboard[y][x] !== 0) {
		cell.classList.add("hit");
	} else {
		cell.classList.add("miss");
	}

	cell.style.pointerEvents = "none";
}

function computerMove() {
	const [ry, rx] = game.computerMove();
	updateCellColor(playerOneBoard, ry, rx, player1.board);
}

function findShipOrigin(ship) {
	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			if (player1.board.gameboard[y][x] === ship) {
				return [y, x];
			}
		}
	}
}
