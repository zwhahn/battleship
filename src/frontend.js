import { Player } from "./battleship.js";
import { Gameplay } from "./battleship.js";

const player1 = new Player();
const player2 = new Player();
const game = new Gameplay(player1, player2);
game.placeShipsRandomly();

const board = document.querySelector(".board-container");

// Player 2's Board
for (let y = 0; y < 10; y++) {
	for (let x = 0; x < 10; x++) {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		board.appendChild(cell);

		cell.dataset.y = y;
		cell.dataset.x = x;

		cell.addEventListener("click", (e) => {
			const cx = e.target.dataset.x;
			const cy = e.target.dataset.y;

			game.handlePlayerMove(cy, cx);

			const cellContent = player2.board.gameboard[cy][cx];

			if (cellContent !== 0) {
				e.target.classList.add("hit");
			} else {
				e.target.classList.add("miss");
			}

			e.target.style.pointerEvents = "none";
		});
	}
}
