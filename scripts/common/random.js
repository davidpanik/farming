// Generate a random integer from the specified range
function random(range) {
	return Math.floor((Math.random() * range));
}

// Return whether a random number out of 100 was less than the percentage specified
function chance(amount) {
	return (random(100) < amount);
}

// Generate a unique identifier
function unique() {
	return Math.random().toString(36).substr(2, 9);
}

export { random, chance, unique };
