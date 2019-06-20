jest.mock('nanoid/non-secure');
jest.mock('../price-tree');

const nanoIdMock = require('nanoid/non-secure');
const LiveOrderBoard = require('./');
const PriceTree = require('../price-tree');

const orderIdStub = '1234';

const buyOrderStub = {
	userId: '1',
	quantityKg: 4.2,
	pricePerKg: 323.77,
	type: 'BUY',
};

const sellOrderStub = {
	userId: '144',
	quantityKg: 6.1,
	pricePerKg: 35,
	type: 'SELL',
};

describe('LiveOrderBoard', () => {
	let liveOrderBoard;

	beforeEach(() => {
		liveOrderBoard = new LiveOrderBoard();
	});

	afterEach(() => {
		PriceTree.mockClear();
		nanoIdMock.mockRestore();
	});

	describe('constructor', () => {
		test('creates two instances of PriceTree', () => {
			expect(PriceTree).toHaveBeenCalledTimes(2);
		});

		test('creates an instance of PriceTree with ASCENDING order', () => {
			expect(PriceTree).toHaveBeenCalledWith('ASCENDING');
		});

		test('creates an instance of PriceTree with DESCENDING order', () => {
			expect(PriceTree).toHaveBeenCalledWith('DESCENDING');
		});
	});

	describe('registerOrder', () => {
		let actualOrderId;

		beforeEach(() => {
			nanoIdMock.mockReturnValueOnce(orderIdStub);

			actualOrderId = liveOrderBoard.registerOrder(sellOrderStub);
		});

		test('returns a correct orderId', () => {
			expect(actualOrderId).toEqual(orderIdStub);
		});

		test('calls `priceTree.addQuantity` once, with correct arguments', () => {
			const mockPriceTreeInstance = PriceTree.mock.instances[0];

			expect(mockPriceTreeInstance.addQuantity).toHaveBeenCalledTimes(1);
			expect(mockPriceTreeInstance.addQuantity.mock.calls[0]).toMatchSnapshot();
		});
	});

	describe('cancelOrder', () => {
		let actualOrderId;

		test('throws an Error when the order does NOT exist', () => {
			expect(() => liveOrderBoard.cancelOrder('someUnknownId')).toThrow(Error);
		});

		test('calls priceTree.removeQuantity once, with correct arguments when the order exists', () => {
			nanoIdMock.mockReturnValueOnce(orderIdStub);

			liveOrderBoard.registerOrder(sellOrderStub);
			liveOrderBoard.cancelOrder(orderIdStub);

			const mockPriceTreeInstance = PriceTree.mock.instances[0];

			expect(mockPriceTreeInstance.removeQuantity).toHaveBeenCalledTimes(1);
			expect(mockPriceTreeInstance.removeQuantity.mock.calls[0]).toMatchSnapshot();
		});
	});

	describe('getBuySummary', () => {
		test('returns a correct buy price summary', () => {
			const mockBuyPriceTreeInstance = PriceTree.mock.instances[1];
			const buySummaryStub = [
				{
					price: 55.8,
					quantity: 13.5,
				},
				{
					price: 69,
					quantity: 6.4,
				},
				{
					price: 76.1,
					quantity: 5.88,
				},
				{
					price: 323.77,
					quantity: 4.2,
				},
			];

			mockBuyPriceTreeInstance.getOrderedValues.mockReturnValueOnce(buySummaryStub);

			expect(liveOrderBoard.getBuySummary()).toEqual(buySummaryStub);
		});
	});

	describe('getSellSummary', () => {
		test('returns a correct sell price summary', () => {
			const mockSellPriceTreeInstance = PriceTree.mock.instances[0];
			const sellSummaryStub = [
				{
					price: 323.77,
					quantity: 4.2,
				},
				{
					price: 76.1,
					quantity: 5.88,
				},
				{
					price: 69,
					quantity: 6.4,
				},
				{
					price: 55.8,
					quantity: 13.5,
				},
			];

			mockSellPriceTreeInstance.getOrderedValues.mockReturnValueOnce(sellSummaryStub);

			expect(liveOrderBoard.getSellSummary()).toEqual(sellSummaryStub);
		});
	});
});
