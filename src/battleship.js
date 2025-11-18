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
