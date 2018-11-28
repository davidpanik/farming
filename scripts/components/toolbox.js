import Component from '../common/component.js';

class Toolbox extends Component {
	constructor(tools, initial) {
		super();

		this.tools = tools;

		Component.store.set('currentTool', initial);

		return this;
	}

	template() {
		let tools = [];

		for (let tool in this.tools) {
			tools.push(this.tools[tool].render());
		}

		return `
			<div class="toolbox">
				${ tools.join('') }
			</div>
		`;
	}
}

export default Toolbox;
