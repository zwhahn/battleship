import { Gameboard, Player, Ship } from "./battleship.js";
import { Gameplay } from "./battleship.js";

const player1 = new Player();
const player2 = new Player();
const game = new Gameplay(player1, player2);

const playerBoards = document.getElementsByClassName("board-container");
const playerOneBoard = playerBoards[0];
const playerTwoBoard = playerBoards[1];

const randomFleetBtn = document.querySelector(".random-fleet-btn");
randomFleetBtn.addEventListener("click", () => {
	player1.board = new Gameboard();
	player2.board = new Gameboard();
	game.placeShipsRandomly();
	drawPlayer1Board();
	drawPlayer2Board();
});

drawPlayer1Board();
drawPlayer2Board();
drawShipyard();

function drawShipyard() {
	const ships = [
		{ name: "carrier", size: 5 },
		{ name: "battleship", size: 4 },
		{ name: "cruiser", size: 3 },
		{ name: "submarine", size: 3 },
		{ name: "destroyer", size: 2 },
	];
	const shipyard = document.querySelector(".shipyard");
	ships.forEach((ship) => {
		const shipDiv = document.createElement("div");
		shipyard.appendChild(shipDiv);

		shipDiv.classList.add("ship-piece");
		shipDiv.draggable = true;
		shipDiv.dataset.name = ship.name;
		shipDiv.dataset.size = ship.size;

		shipDiv.addEventListener("dragstart", (e) => {
			e.dataTransfer.setData("size", shipDiv.dataset.size);
			e.dataTransfer.setData("name", shipDiv.dataset.name);
		});

		for (let i = 0; i < ship.size; i++) {
			const cell = document.createElement("div");
			cell.classList.add("cell");
			shipDiv.appendChild(cell);
		}
	});
}

function removeFromShipyard(shipName) {
	const shipyard = document.querySelector(".shipyard");
	for (const child of shipyard.children) {
		if (child.dataset.name === shipName) {
			shipyard.removeChild(child);
		}
	}
}

// Player 1's Board
function drawPlayer1Board() {
	playerOneBoard.innerHTML = "";

	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			const cell = document.createElement("div");
			if (player1.board.gameboard[y][x] !== 0) {
				cell.classList.add("ship");
			}
			cell.classList.add("cell");
			playerOneBoard.appendChild(cell);

			cell.dataset.y = y;
			cell.dataset.x = x;

			cell.addEventListener("dragover", (e) => {
				e.preventDefault();
			});

			cell.addEventListener("drop", (e) => {
				const shipSize = parseInt(e.dataTransfer.getData("size"));
				const shipName = e.dataTransfer.getData("name");
				console.log("dropped");

				const placed = placeShipOnBoard(shipSize, [y, x]);
				console.log("placed: ", placed);
				if (placed) {
					removeFromShipyard(shipName);
				}
			});
		}
	}
}

function placeShipOnBoard(size, [y, x]) {
	const ship = new Ship(size);

	console.log(ship);

	const placed = player1.board.place(ship, [y, x]);

	if (placed) {
		console.log("placed");
		drawPlayer1Board();
		return true;
	}
	return false;
}

// Player 2's Board
function drawPlayer2Board() {
	playerTwoBoard.innerHTML = "";

	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			const cell = document.createElement("div");
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
				computerMove();
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
