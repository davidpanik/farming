import Component from '../common/component.js';

class Tool extends Component {
	constructor(name, cooldown = 0) {
		super();

		this.active = false;
		this.available = true;
		this.name = name;
		this.cooldown = cooldown;
		this.timer = null;

		this.events = {
			'toolClicked': () => {
				this.work();
			}
		};		

		Component.pubsub.on('storeUpdated', (state) => {
			this.active = (state.currentTool === this.name);

			this.emit('render');
		});

		return this;
	}

	work() {
		if (!this.available) {
			return this;
		}

		this.available = false;

		this.timer = setTimeout(() => {
			this.available = true;
			clearTimeout(this.timer);
			this.timer = null;
		}, this.cooldown);

		Component.store.set('currentTool', this.name);

		return this;
	}

	template() {
		return `<button class="tool ${ this.active ? 'active' : '' } ${ this.available ? 'available' : '' }" @click="toolClicked">${ this.name }</button>`;
	}
}

export default Tool;
