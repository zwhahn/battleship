export class Ship {
	constructor(length, hits = 0, sunk = false, horizontal = true) {
		this.length = length;
		this.hits = hits;
		this.sunk = sunk;
		this.horizontal = horizontal;
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
		if (!this.shipOverlap(ship, [y, x])) {
			if (ship.horizontal === true) {
				for (let i = 0; i < ship.length; i++) {
					this.gameboard[y][x + i] = ship;
				}
				return true;
			}
			if (ship.horizontal === false) {
				for (let j = 0; j < ship.length; j++) {
					this.gameboard[y + j][x] = ship;
				}
				return true;
			}
		}
		return false;
	}

	shipOverlap(ship, [y, x]) {
		if (ship.horizontal === true) {
			for (let i = 0; i < ship.length; i++) {
				if (x + i > 9 || this.gameboard[y][x + i] != 0) {
					return true;
				}
			}
		}
		if (ship.horizontal === false) {
			for (let j = 0; j < ship.length; j++) {
				if (y + j > 9 || this.gameboard[y + j][x] != 0) {
					return true;
				}
			}
		}
		return false;
	}

	receiveAttack([y, x]) {
		if (!this.alreadyPlaced([y, x])) {
			if (this.gameboard[y][x] !== 0) {
				this.gameboard[y][x].hit();
			}
			this.historyBoard[y][x] = 1;
		} else {
			this.historyBoard[y][x] = 1;
		}
	}

	alreadyPlaced([y, x]) {
		if (this.historyBoard[y][x] == 1) {
			return true;
		} else {
			return false;
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

export class Player {
	constructor() {
		this.board = new Gameboard();
	}
}

export class Gameplay {
	constructor(player1, player2) {
		this.player1 = player1;
		this.player2 = player2;
		this.currentPlayer = player1;
	}

	placeShipsRandomly() {
		const shipLibrary = {
			carrier: new Ship(5),
			battleship: new Ship(4),
			cruiser: new Ship(3),
			submarine: new Ship(3),
			destroyer: new Ship(2),
		};

		// Player 1 placement
		for (const ship of Object.values(shipLibrary)) {
			let placed = false;
			while (!placed) {
				const coords = this.getRandomSquare();
				ship.horizontal = Math.random() < 0.5;
				placed = this.player1.board.place(ship, coords);
			}
		}

		// Player 2 placement
		for (const ship of Object.values(shipLibrary)) {
			let placed = false;
			while (!placed) {
				const coords = this.getRandomSquare();
				ship.horizontal = Math.random() < 0.5;
				placed = this.player2.board.place(ship, coords);
			}
		}
	}

	handlePlayerMove(y, x) {
		const enemyBoard = this.getEnemyBoard();
		enemyBoard.receiveAttack([y, x]);
		this.switchTurns();
	}

	switchTurns() {
		if (this.currentPlayer == this.player1) {
			this.currentPlayer = this.player2;
		} else {
			this.currentPlayer = this.player1;
		}
	}

	getEnemyBoard() {
		if (this.currentPlayer === this.player1) {
			return this.player2.board;
		} else {
			return this.player1.board;
		}
	}

	computerMove() {
		let moved = false;
		let y, x;

		while (!moved) {
			[y, x] = this.getRandomSquare();
			if (!this.getEnemyBoard().alreadyPlaced([y, x])) {
				this.handlePlayerMove(y, x);
				moved = true;
			}
		}

		return [y, x];
	}

	getRandomSquare() {
		const y = Math.round(Math.random() * 9);
		const x = Math.round(Math.random() * 9);
		return [y, x];
	}
}
