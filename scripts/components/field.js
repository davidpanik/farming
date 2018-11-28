import Cell from './cell.js';
import Component from '../common/component.js';

class Field extends Component {
	constructor(width, height) {
		super();

		this.data = Array.from({ length: height }, 
			() => Array.from({ length: width },
				() => new Cell())
		);

		return this;
	}

	template() {
		let rows = this.data.map((row) => {
			let cells = row.map((cell) => cell.render());

			return `
				<div class="row">
					${ cells.join('') }
				</div>
			`;
		});

		return `
			<div class="field">
				${ rows.join('') }
			</div>
		`;
	}
}

export default Field;
