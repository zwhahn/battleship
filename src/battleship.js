export class Ship {
	constructor(length, hits, sunk) {
		this.length = length;
		this.hits = hits;
		this.sunk = sunk;
	}

	hit() {
		this.hits += 1;
	}

	isSunk() {
		if (this.hits >= this.length) {
			return true;
		} else {
			return false;
		}
	}
}

export class Gameboard {
	constructor() {
		this.board = [];
		for (let i = 0; i < 10; i++) {
			this.board[i] = [];
			for (let j = 0; j < 10; j++) {
				this.board[i][j] = 0;
			}
		}
	}

	place(ship, [y, x]) {
		for (let i = 0; i < ship.length; i++) {
			this.board[y][x + i] = ship;
		}
	}

	receiveAttack([y, x]) {
		if (this.board[y][x] != 0 && this.board[y][x] != 1) {
			this.board[y][x].hit();
		} else {
			this.board[y][x] = 1;
		}
	}
}
