export class Ship {
	constructor(length, hits = 0, sunk = false) {
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

		for (let ship in shipLibrary) {
			this.player1.board.place(ship, this.getRandomSquare());
			this.player2.board.place(ship, this.getRandomSquare());
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
			this.computerMove();
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
		const [y, x] = this.getRandomSquare();
		this.handlePlayerMove(y, x);
	}

	getRandomSquare() {
		const y = Math.round(Math.random() * 9);
		const x = Math.round(Math.random() * 9);
		return [y, x];
	}
}
