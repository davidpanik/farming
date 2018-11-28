import Component from '../common/component.js';

class Cash extends Component {
	constructor(initial = 0) {
		super();

		Component.store.set('cash', initial);

		return this;
	}

	template() {
		return `
			<div class="cash">
				£${ Component.store.get('cash') }
			</div>
		`;
	}
}

export default Cash;
