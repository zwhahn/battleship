import { Ship } from "./battleship";

test("hit function", () => {
	const ship = new Ship(3, 0, false);

	ship.hit();
	expect(ship.hits).toBe(1);

	ship.hit();
	expect(ship.hits).toBe(2);
});
