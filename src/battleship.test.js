import { Ship } from "./battleship";
import { Gameboard } from "./battleship";

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

test("already guessed, no ship", () => {
	const board = new Gameboard();
	board.receiveAttack([3, 2]);
});
