// https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060

import Component from './component.js';

class VirtualDom {
	constructor(target, html) {
		this.target = target;

		clearNode(this.target);

		return this;
	}

	createVirtualTree(html) {
		let obj = document.createElement('div');
		obj.innerHTML = html;

		return createVirtualElement(obj).children[0];
	}

	update(html) {
		updateElement(this.target, this.createVirtualTree(html), this.virtualTree);

		this.virtualTree = this.createVirtualTree(html);

		return this;
	}
}

function createVirtualElement(obj) {
	let props = {};
	let type = obj.nodeName.toLowerCase();

	if (obj.attributes) {
		for (let looper = 0; looper < obj.attributes.length; looper++) {
			let node = obj.attributes[looper];
			props[node.nodeName] = node.nodeValue;
		}
	}

	if (type === '#text') {
		props.text = obj.textContent.trim();
	}

	let children =
		[].slice.call(obj.childNodes)
			.filter((child) => {
				return child.nodeName !== '#text' || child.textContent.trim() !== '';
			});

	return {
		type: type,
		props: props,
		children: children.map((child) => createVirtualElement(child))
	};
}

function createRealElement(node) {
	if (node.type === '#text') {
		return document.createTextNode(node.props.text);
	}

	let element = document.createElement(node.type);

	node.children
		.map((child) => createRealElement(child))
		.forEach(element.appendChild.bind(element));

	for (name in node.props) {
		if (name.charAt(0) === '@') {
			let eventName = node.props[name];
			let props = node.props;

			element.addEventListener(name.replace('@', ''), (event) => {
				Component.pubsub.emit(eventName, { props: props, event: event });
			});
		} else {
			element.setAttribute(name, node.props[name]);
		}
	}

	return element;
}

function updateElement($parent, newNode, oldNode, index = 0) {
	if (!oldNode) {
		$parent.appendChild(
			createRealElement(newNode)
		);
	} else if (!newNode) {
		$parent.removeChild(
			$parent.childNodes[index]
		);
	} else if (changed(newNode, oldNode)) {
		$parent.replaceChild(
			createRealElement(newNode),
			$parent.childNodes[index]
		);
	} else if (newNode.type) {
		const newLength = newNode.children.length;
		const oldLength = oldNode.children.length;
		for (let i = 0; i < newLength || i < oldLength; i++) {
			updateElement(
				$parent.childNodes[index],
				newNode.children[i],
				oldNode.children[i],
				i
			);
		}
	}
}

function clearNode(node) {
	while (node.firstChild) {
		node.removeChild(node.firstChild);
	}
}

function changed(node1, node2) {
	return node1.type !== node2.type || JSON.stringify(node1.props) !== JSON.stringify(node2.props) ;
}

export default VirtualDom;
