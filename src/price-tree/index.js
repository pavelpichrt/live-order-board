const AVLTree = require('avl');

class PriceTree {
	constructor(type) {
		// ASC order is default
		const comparator = type === PriceTree.DESC ? this._descComparator : undefined;

		this._tree = new AVLTree(comparator, true);
	}

	_descComparator(price1, price2) {
		let result;

		if (price1 === price2) {
			result = 0;
		} else {
			result = price1 < price2 ? 1 : -1;
		}

		return result;
	}

	// O(log n)
	removeQuantity(price, quantity) {
		const existingNode = this._tree.find(price);
		let newQuantity;

		if (existingNode) {
			newQuantity = existingNode.data.quantity - quantity;

			if (newQuantity > 0) {
				existingNode.data.quantity = newQuantity;
			} else {
				this._tree.remove(price);
			}
		}
	}

	// O(log n)
	addQuantity(price, quantity) {
		const existingNode = this._tree.find(price);

		if (existingNode) {
			existingNode.data.quantity += quantity;
		} else {
			this._tree.insert(price, { price, quantity });
		}
	}

	// This is already a sorted array: Complexity = O(1)
	getOrderedValues() {
		return this._tree.values();
	}
}

PriceTree.ASC = 'ASCENDING';
PriceTree.DESC = 'DESCENDING';

module.exports = PriceTree;
