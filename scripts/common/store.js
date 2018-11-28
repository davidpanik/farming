// A Redux-like way of containing state
class Store {
	constructor(pubsub, data = {}) {
		this._data = data; // Should never modify this directly!
		this.pubsub = pubsub;

		return this;
	}

	// If no argument is given, return a copy of the entire data object
	// If an argument is given, return the matching content from the data object
	get(key) {
		let data = clone(this._data);

		if (key) {
			return data[key];
		}

		return data;
	}

	// If two arguments are given, update the matching key in the data store (using mutation)
	// If one argument is given, use that to overwrite the entire data store
	set(data, value) {
		if (typeof(value) !== 'undefined') {
			let key = data;

			this.mutate((state) => {
				state[key] = value;
				return state;
			});

			return this;	
		}

		this._data = clone(data);
		this.pubsub.emit('storeUpdated', data);

		return this;
	}

	// Specify a mutator function which will set a new state
	// e.g. mutate((oldState) => newState);
	mutate(mutator) {
		this.set(mutator(this.get()));
	}
}

// Create a duplicate copy on an object - poor man's immutability
function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

export default Store;
