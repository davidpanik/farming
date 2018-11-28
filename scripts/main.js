import VirtualDom from './common/virtualdom.js';
import Component from './common/component.js';

import Field from './components/field.js';
import Toolbox from './components/toolbox.js';
import Tool from './components/tool.js';
import Cash from './components/cash.js';

let field = new Field(10, 20);
let toolbox = new Toolbox({
	'scythe': new Tool('scythe', 500),
	'hammer': new Tool('hammer', 1000),
	'hoe': new Tool('hoe', 500),
	'seeds': new Tool('seeds', 1000),
	'hose': new Tool('hose', 0),
	'pitchfork': new Tool('pitchfork', 1000)
}, 'seeds');
let cash = new Cash(10);

let virtualDom = new VirtualDom(document.getElementById('app'));

function render() {
	let template = `
		<div>
			${ field.render() }
			${ toolbox.render() }
			${ cash.render() }
		</div>
	`;

	virtualDom.update(template);
}

render();
Component.pubsub.on('render', render);
