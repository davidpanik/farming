import { chance } from '../common/random.js';
import Component from '../common/component.js';

class Cell extends Component {
	constructor() {
		super();

		// Random chance of stones
		this.state = chance(10) ? 'stone' : 'grass';
		this.timer = null;
		this.disabled = false;

		// Click handler
		this.events = {
			'cellClicked': () => {
				this.work();
			}
		};

		return this;
	}

	work() {
		if (this.disabled) {
			return this;
		}

		let action = actions[this.state];

		// Only proceed if the correct tool is currently selected
		if (action.tool && action.tool !== Component.store.get('currentTool')) {
			return this;
		}

		// Only proceed if we can afford to use this tool
		if (action.cost && (Component.store.get('cash') + action.cost < 0)) {
			return this;
		}

		// Some actions take awhile to happen
		if (action.duration) {
			this.disabled = true;

			this.timer = setTimeout(() => {
				clearTimeout(this.timer);
				this.timer = null;
				this.disabled = false;
				this.state = action.nextState();
				this.emit('render');

				if (actions[this.state].duration) {
					this.work();
				}
			}, action.duration);

			return this;
		}

		// Pay the cost of this component (if there is)
		if (action.cost) {
			Component.store.set('cash', Component.store.get('cash') + action.cost)
		}

		// Proceed to the next state
		this.state = action.nextState();
		if (actions[this.state].duration) {
			this.work();
		}

		this.emit('render');

		return this;
	}

	template() {
		let action = actions[this.state];
		let disabled = this.disabled || (action.tool && action.tool !== Component.store.get('currentTool'));

		return `
			<button class="cell ${ this.state } ${ disabled ? 'disabled' : '' }" title="${ action.title }" @click="cellClicked"></button>
		`;
	}
}

const actions = {
	'grass': {
		tool: 'scythe',
		title: 'Grass - cut with a scythe',
		nextState: () => 'untilled'
	},
	'stone': {
		tool: 'hammer',
		title: 'Stone - break with a hammer',
		nextState: () => chance(50) ? 'stone' : 'broken'
	},
	'broken': {
		tool: 'hammer',
		title: 'Stone - break with a hammer',
		nextState: () => 'grass'
	},
	'untilled': {
		tool: 'hoe',
		title: 'Soil - till with a hoe',
		nextState: () => 'tilled'
	},
	'tilled': {
		tool: 'seeds',
		cost: -1,		
		title: 'Soil - ready for seeds',
		nextState: () => 'planted'
	},
	'planted': {
		tool: 'hose',
		title: 'Seeds - ready to be watered',
		nextState: () => 'watered'
	},
	'watered': {
		duration: 2000,
		title: 'Plants - wait for them to grow',
		nextState: () => 'growing'
	},
	'failed': {
		tool: 'scythe',
		title: 'Failed crops - clear with a scythe',
		nextState: () => 'untilled'
	},
	'growing': {
		duration: 2000,
		title: 'Plants - wait for them to grow',
		nextState: () => chance(80) ? 'grown' : 'failed'
	},
	'grown': {
		tool: 'scythe',
		title: 'Plants - harvest them with a scythe',
		nextState: () => 'harvested'
	},	
	'harvested': {
		tool: 'pitchfork',
		title: 'Harvest - collect with a pitchfork',
		cost: 3,
		nextState: () => chance(80) ? 'untilled' : 'grass'
	}
}

export default Cell;
