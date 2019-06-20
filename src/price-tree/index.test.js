const PriceTree = require('./');

// Initial stubs don't contain any duplicate prices
const priceQuantitiesStubs = require('./__stubs__/price-quantities');

describe('PriceTree', () => {
	let priceTree;

	describe('sorted in ASCENDING order', () => {
		beforeEach(() => {
			priceTree = new PriceTree(PriceTree.ASC);
		});

		describe('getOrderedValues', () => {
			const existingPrice = priceQuantitiesStubs[0].price;
			const currentQuantity = priceQuantitiesStubs[0].quantity;
			const newOrderQuantity = 1.5;
			const samePriceOrderStub = {
				price: existingPrice,
				quantity: newOrderQuantity,
			};

			beforeEach(() => {
				priceQuantitiesStubs.forEach(({ price, quantity }) => {
					priceTree.addQuantity(price, quantity);
				});
			});

			describe('addQuantity', () => {
				test('aggregates quantities at DIFFERENT prices correctly', () => {
					expect(priceTree.getOrderedValues()).toHaveLength(priceQuantitiesStubs.length);
					expect(priceTree.getOrderedValues()).toMatchSnapshot();
				});

				test('aggregates quantities correctly with multiple quantities at the SAME price', () => {
					priceQuantitiesStubs.slice(0, 2).forEach(({ price, quantity }) => {
						priceTree.addQuantity(price, quantity);
					});

					expect(priceTree.getOrderedValues()).toHaveLength(priceQuantitiesStubs.length);
					expect(priceTree.getOrderedValues()).toMatchSnapshot();
				});
			});

			describe('removeQuantity', () => {
				test('removes the price when the remaining quantity is 0', () => {
					const priceStub = priceQuantitiesStubs[1];

					priceTree.removeQuantity(priceStub.price, priceStub.quantity);

					expect(priceTree.getOrderedValues()).toHaveLength(priceQuantitiesStubs.length - 1);
					expect(priceTree.getOrderedValues()).toMatchSnapshot();
				});

				describe('when the remaining quantity is greater than 0', () => {
					beforeEach(() => {
						// first add some quantities at duplicate price points
						priceQuantitiesStubs.slice(0, 2).forEach(({ price, quantity }) => {
							priceTree.addQuantity(price, quantity);
						});

						const priceStub = priceQuantitiesStubs[1];

						priceTree.removeQuantity(priceStub.price, priceStub.quantity);
					});

					test('decreases the quantity for a price correctly', () => {
						expect(priceTree.getOrderedValues()).toMatchSnapshot();
					});

					test('does NOT remove the price from the tree', () => {
						expect(priceTree.getOrderedValues()).toHaveLength(priceQuantitiesStubs.length);
					});
				});
			});
		});
	});

	describe('sorted in DESCENDING order', () => {
		beforeEach(() => {
			priceTree = new PriceTree(PriceTree.DESC);
		});

		describe('getOrderedValues', () => {
			const existingPrice = priceQuantitiesStubs[0].price;
			const currentQuantity = priceQuantitiesStubs[0].quantity;
			const newOrderQuantity = 1.5;
			const samePriceOrderStub = {
				price: existingPrice,
				quantity: newOrderQuantity,
			};

			beforeEach(() => {
				priceQuantitiesStubs.forEach(({ price, quantity }) => {
					priceTree.addQuantity(price, quantity);
				});
			});

			describe('addQuantity', () => {
				test('aggregates quantities at DIFFERENT prices correctly', () => {
					expect(priceTree.getOrderedValues()).toHaveLength(priceQuantitiesStubs.length);
					expect(priceTree.getOrderedValues()).toMatchSnapshot();
				});

				test('aggregates quantities correctly with multiple quantities at the SAME price', () => {
					priceQuantitiesStubs.slice(0, 2).forEach(({ price, quantity }) => {
						priceTree.addQuantity(price, quantity);
					});

					expect(priceTree.getOrderedValues()).toHaveLength(priceQuantitiesStubs.length);
					expect(priceTree.getOrderedValues()).toMatchSnapshot();
				});
			});

			describe('removeQuantity', () => {
				test('removes the price when the remaining quantity is 0', () => {
					const priceStub = priceQuantitiesStubs[1];

					priceTree.removeQuantity(priceStub.price, priceStub.quantity);

					expect(priceTree.getOrderedValues()).toHaveLength(priceQuantitiesStubs.length - 1);
					expect(priceTree.getOrderedValues()).toMatchSnapshot();
				});

				describe('when the remaining quantity is greater than 0', () => {
					beforeEach(() => {
						// first add some quantities at duplicate price points
						priceQuantitiesStubs.slice(0, 2).forEach(({ price, quantity }) => {
							priceTree.addQuantity(price, quantity);
						});

						const priceStub = priceQuantitiesStubs[1];

						priceTree.removeQuantity(priceStub.price, priceStub.quantity);
					});

					test('decreases the quantity for a price correctly', () => {
						expect(priceTree.getOrderedValues()).toMatchSnapshot();
					});

					test('does NOT remove the price from the tree', () => {
						expect(priceTree.getOrderedValues()).toHaveLength(priceQuantitiesStubs.length);
					});
				});
			});
		});
	});
});
