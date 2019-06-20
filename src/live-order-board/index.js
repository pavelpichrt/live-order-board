const nanoid = require('nanoid/non-secure');
const PriceTree = require('../price-tree');

class LiveOrderBoard {
	constructor() {
		// Object hash table lookups significantly outperform ES6 Map
		this._orders = {};
		this._sellPriceTree = new PriceTree(PriceTree.ASC);
		this._buyPriceTree = new PriceTree(PriceTree.DESC);
	}

	_getPriceTree(type) {
		return type === 'BUY' ? this._buyPriceTree : this._sellPriceTree;
	}

	cancelOrder(orderId) {
		const { pricePerKg, quantityKg, type } = this._orders[orderId] || {};
		let priceTree;

		if (!pricePerKg) {
			throw new Error(`Order ${orderId} does not exist.`);
		}

		priceTree = this._getPriceTree(type);
		priceTree.removeQuantity(pricePerKg, quantityKg);

		delete this._orders[orderId];
	}

	registerOrder({ userId, quantityKg, pricePerKg, type } = {}) {
		const priceTree = this._getPriceTree(type);
		const orderId = nanoid();

		this._orders[orderId] = { userId, quantityKg, pricePerKg, type };

		priceTree.addQuantity(pricePerKg, quantityKg);

		return orderId;
	}

	getBuySummary(numberOfItems) {
		return this._buyPriceTree.getOrderedValues();
	}

	getSellSummary() {
		return this._sellPriceTree.getOrderedValues();
	}
}

module.exports = LiveOrderBoard;
