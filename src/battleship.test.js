import { Ship } from "./battleship";
import { Gameboard } from "./battleship";
import { Player } from "./battleship";
import { Gameplay } from "./battleship";

test("hit function", () => {
	const ship = new Ship(3, 0, false);

	ship.hit();
	expect(ship.hits).toBe(1);

	ship.hit();
	expect(ship.hits).toBe(2);
});

test("check sunk", () => {
	const ship = new Ship(2, 0, false);

	ship.hit();
	expect(ship.isSunk()).toBe(false);

	ship.hit();
	expect(ship.isSunk()).toBe(true);
});

test("blank board", () => {
	const board = new Gameboard();

	expect(board.gameboard[0].length).toBe(10);
	expect(board.historyBoard[0].length).toBe(10);
	expect(board.gameboard.length).toBe(10);
	expect(board.historyBoard.length).toBe(10);
});

test("place ship", () => {
	const board = new Gameboard();
	const ship = new Ship(3, 0, false);

	board.place(ship, [0, 0]);

	expect(board.gameboard[0][0]).toEqual(ship);
	expect(board.gameboard[0][1]).toEqual(ship);
	expect(board.gameboard[0][2]).toEqual(ship);
	expect(board.gameboard[0][3]).not.toEqual(ship);
});

test("place ship, vertical", () => {
	const board = new Gameboard();
	const ship = new Ship(3, 0, false, false);

	board.place(ship, [0, 9]);

	expect(board.gameboard[0][9]).toEqual(ship);
	expect(board.gameboard[1][9]).toEqual(ship);
	expect(board.gameboard[2][9]).toEqual(ship);
	expect(board.gameboard[3][9]).not.toEqual(ship);

	board.place(ship, [9, 0]);
	expect(board.gameboard[9][0]).not.toEqual(ship);
});

test("hit ship", () => {
	const board = new Gameboard();
	const ship = new Ship(3, 0, false);
	board.place(ship, [0, 0]);

	board.receiveAttack([0, 0]);
	expect(board.gameboard[0][0].hits).toBe(1);

	board.receiveAttack([0, 1]);
	expect(board.gameboard[0][1].hits).toBe(2);

	board.receiveAttack([0, 2]);
	expect(board.gameboard[0][2].hits).toBe(3);
});

test("missed ship", () => {
	const board = new Gameboard();
	board.receiveAttack([3, 2]);

	expect(board.historyBoard[3][2]).toBe(1);
});

test("already guessed, no ship", () => {
	const board = new Gameboard();
	board.receiveAttack([3, 2]);

	expect(board.historyBoard[3][2]).toBe(1);

	board.receiveAttack([3, 2]);
	expect(board.historyBoard[3][2]).toBe(1);
});

test("already guessed, ship", () => {
	const board = new Gameboard();
	const ship = new Ship(3, 0, false);
	board.place(ship, [0, 0]);

	board.receiveAttack([0, 1]);
	expect(board.gameboard[0][1].hits).toBe(1);
	board.receiveAttack([0, 1]);
	expect(board.gameboard[0][1].hits).toBe(1);
});

test("all ships sank, 1 ship", () => {
	const board = new Gameboard();
	const ship = new Ship(3, 0, false);
	board.place(ship, [0, 0]);
	board.receiveAttack([0, 0]);
	board.receiveAttack([0, 1]);
	board.receiveAttack([0, 2]);

	expect(board.allSunk()).toBe(true);
});

test("all ships sank, mult ship", () => {
	const board = new Gameboard();
	const ship = new Ship(3, 0, false);
	board.place(ship, [0, 0]);
	board.receiveAttack([0, 0]);
	board.receiveAttack([0, 1]);
	board.receiveAttack([0, 2]);

	const shipTwo = new Ship(3, 0, false);
	board.place(shipTwo, [2, 0]);
	board.receiveAttack([2, 0]);
	board.receiveAttack([2, 1]);
	board.receiveAttack([2, 2]);

	expect(board.allSunk()).toBe(true);

	const shipThree = new Ship(3, 0, false);
	board.place(shipThree, [4, 0]);
	board.receiveAttack([4, 0]);
	board.receiveAttack([4, 1]);

	expect(board.allSunk()).toBe(false);
});

test("player board creation", () => {
	const playerOne = new Player();

	expect(playerOne.board).toEqual(new Gameboard());
});

test("take turn", () => {
	const player1 = new Player();
	const player2 = new Player();
	const game = new Gameplay(player1, player2);
	game.handlePlayerMove(1, 0);
	expect(player2.board.historyBoard[1][0]).toBe(1);
	game.computerMove();
	game.handlePlayerMove(1, 1);
	expect(player2.board.historyBoard[1][1]).toBe(1);
});

test("ship overlap", () => {
	const board = new Gameboard();
	const ship1 = new Ship(3, 0, false);
	board.place(ship1, [0, 0]);
	const ship2 = new Ship(4, 0, false);
	board.place(ship2, [0, 2]);
	expect(board.gameboard[0][2]).toEqual(ship1);
	expect(board.gameboard[0][3]).not.toEqual(ship1);
	expect(board.gameboard[0][3]).not.toEqual(ship2);
});

test("view board", () => {
	let player1 = new Player();
	let player2 = new Player();
	const game = new Gameplay(player1, player2);

	game.placeShipsRandomly(player1);

	let shipCellCount = 0;

	for (let row of player1.board.gameboard) {
		for (let cell of row) {
			if (cell !== 0) {
				shipCellCount++;
			}
		}
	}

	expect(shipCellCount).toBe(17);
});
