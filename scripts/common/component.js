import { unique } from './random.js';
import PubSub from './pubsub.js';
import Store from './store.js';

const pubsub = new PubSub();
const store = new Store(pubsub);

// A simple Vue/React-like component helper
class Component {
	constructor() {
		// Generate a unique id for identifying events later
		this.uid = unique();

		// Run the handle events function (but not immediately, ensure the instance has been created first)
		setTimeout(this.handleEvents.bind(this), 0);

		return this;
	}

	// If an events object has been specified then use that to listen for events
	handleEvents() {
		if (this.events) {
			for (let event in this.events) {
				Component.pubsub.on(event, (data) => {
					// We're only interested in events which match this instance's unique identifeir
					if (data.props.uid === this.uid) {
						this.events[event](data);
					}
				});
			}
		}
	}

	// Take the response from the template() function and inject and identifier attribute
	render() {
		return this.template().replace('>', ` uid="${this.uid}">`);
	}

	// Emit an event to the pubsub
	emit(event, data) {
		Component.pubsub.emit(event, data);
	}

	// Make the store available statically
	static get store() {
		return store;
	}

	// Make the pubsub available statically
	static get pubsub() {
		return pubsub;
	}
}

export default Component;
