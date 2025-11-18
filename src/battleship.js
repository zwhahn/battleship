export class Ship {
	constructor(length, hits, sunk = false) {
		this.length = length;
		this.hits = hits;
		this.sunk = sunk;
	}

	hit() {
		this.hits += 1;
		this.isSunk();
	}

	isSunk() {
		if (this.hits >= this.length) {
			this.sunk = true;
			return true;
		} else {
			return false;
		}
	}
}

export class Gameboard {
	constructor() {
		this.gameboard = [];
		for (let i = 0; i < 10; i++) {
			this.gameboard[i] = [];
			for (let j = 0; j < 10; j++) {
				this.gameboard[i][j] = 0;
			}
		}
		this.historyBoard = [];
		for (let i = 0; i < 10; i++) {
			this.historyBoard[i] = [];
			for (let j = 0; j < 10; j++) {
				this.historyBoard[i][j] = 0;
			}
		}
	}

	place(ship, [y, x]) {
		for (let i = 0; i < ship.length; i++) {
			this.gameboard[y][x + i] = ship;
		}
	}

	receiveAttack([y, x]) {
		if (this.gameboard[y][x] != 0 && this.historyBoard[y][x] != 1) {
			this.gameboard[y][x].hit();
			this.historyBoard[y][x] = 1;
		} else {
			this.historyBoard[y][x] = 1;
		}
	}

	allSunk() {
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				if (this.gameboard[i][j] !== 0) {
					if (this.gameboard[i][j].sunk === false) {
						return false;
					}
				}
			}
		}
		return true;
	}
}
