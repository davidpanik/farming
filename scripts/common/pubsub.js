// A publish/subscrube event system
class PubSub {
	constructor() {
		this.queue = {};

		return this;
	}

	// Publish an event to all listeners
	emit(event, data) {
		if (this.queue[event]) {
			this.queue[event].forEach((callback) => { callback(data); });
		}
	}

	// Add a new event listener
	on(event, callback) {
		if (!this.queue[event]) {
			this.queue[event] = [];
		}

		this.queue[event].push(callback);

		return this;
	}

	// Remove an event listener
	off(event, callback) {
		if (this.queue[event]) {
			let index = this.queue[event].indexOf(callback);

			if (index) {
				this.queue[event].splice(index, 1);
			}
		}

		return this;
	}
}

export default PubSub;
