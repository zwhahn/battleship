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

	place(ship, [x, y]) {
		for (let i = 0; i < ship.length; i++) {
			this.board[x + i][y] = ship;
		}
	}
}
