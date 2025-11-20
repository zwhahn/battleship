import { Player } from "./battleship.js";
import { Gameplay } from "./battleship.js";

const player1 = new Player();
const player2 = new Player();
const game = new Gameplay(player1, player2);
game.placeShipsRandomly();

const playerBoards = document.getElementsByClassName("board-container");
const playerOneBoard = playerBoards[0];
const playerTwoBoard = playerBoards[1];

// Player 1's Board
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
	}
}

// Player 2's Board
for (let y = 0; y < 10; y++) {
	for (let x = 0; x < 10; x++) {
		const cell = document.createElement("div");
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
