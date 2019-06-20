# LiveOrderBoard
A test implementation of a buy/sell order aggregator based on an efficient storing algorithm (AVL tree). Tiny in size (7.6kB minified).

## TL;DR
- Install: `npm install live-order-board`
- Unit tests: `npm test`

## Complexity
- Register an order: O(log n)
- Cancel an order: O(log n)
- Get BUY/SELL orders sorted by price: O(1)

## API

```javascript
import LiveOrderBoard from 'live-order-board';

const board = new LiveOrderBoard();

board.registerOrder({
	userId: '1',
	quantityKg: 4.2,
	pricePerKg: 323.77,
	type: 'BUY',
});

const orderId = board.registerOrder({
	userId: '144',
	quantityKg: 6.1,
	pricePerKg: 35,
	type: 'SELL',
});

board.cancelOrder(orderId);

console.log(board.getBuySummary());
console.log(board.getSellSummary());
```
