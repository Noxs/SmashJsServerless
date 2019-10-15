describe('Queue', () => {
	let Queue = null;
	const promiseFunctionResolve = () => {
		return new Promise(resolve => {
			resolve(true);
		});
	};

	const promiseFunctionReject = () => {
		return new Promise((resolve, reject) => {
			reject(new Error("FOOBAR"));
		});
	};

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../smash');
		Queue = require("../../../../lib/core/filter/util/queue");
	});

	beforeEach(() => {

	});

	it('Test constructor', () => {
		const queue = new Queue();
		this.queue = [];
		this.parameters = null;
		this.resolve = null;
		this.reject = null;
		this.started = false;
		expect(queue.queue).toStrictEqual([]);
		expect(queue.parameters).toBe(null);
		expect(queue.resolve).toBe(null);
		expect(queue.reject).toBe(null);
		expect(queue.started).toBe(false);
	});

	it('Test add case #1', () => {
		const queue = new Queue();
		queue.add({ execute: promiseFunctionResolve, priority: 50 });
		queue.add({ execute: promiseFunctionResolve, priority: 60 });
		queue.add({ execute: promiseFunctionResolve, priority: 70 });
		queue.add({ execute: promiseFunctionResolve, priority: 80 });
		queue.add({ execute: promiseFunctionResolve, priority: 10 });
		queue.add({ execute: promiseFunctionResolve, priority: 20 });
		queue.add({ execute: promiseFunctionResolve, priority: 20 });
		expect(queue.queue.length).toBe(7);
	});

	it('Test start case #1', async () => {
		const queue = new Queue();
		await expect(queue.start()).resolves.toBe(true);
	});

	it('Test start case #2', async () => {
		const queue = new Queue();
		queue.add({ execute: promiseFunctionResolve, priority: 50 });
		queue.add({ execute: promiseFunctionResolve, priority: 60 });
		queue.add({ execute: promiseFunctionResolve, priority: 70 });
		queue.add({ execute: promiseFunctionResolve, priority: 80 });
		queue.add({ execute: promiseFunctionResolve, priority: 10 });
		queue.add({ execute: promiseFunctionResolve, priority: 20 });
		queue.add({ execute: promiseFunctionResolve, priority: 20 });
		await expect(Promise.all([queue.start(), queue.start()])).rejects.toThrow();
	});

	it('Test start case #3', async () => {
		const queue = new Queue();
		queue.add({ execute: promiseFunctionResolve, priority: 50 });
		queue.add({ execute: promiseFunctionResolve, priority: 60 });
		queue.add({ execute: promiseFunctionResolve, priority: 70 });
		queue.add({ execute: promiseFunctionReject, priority: 80 });
		queue.add({ execute: promiseFunctionResolve, priority: 10 });
		queue.add({ execute: promiseFunctionResolve, priority: 20 });
		queue.add({ execute: promiseFunctionResolve, priority: 20 });
		await expect(queue.start()).rejects.toThrow();
	});

	it('Test start case #4', async () => {
		const queue = new Queue();
		queue.add({ execute: promiseFunctionResolve, priority: 50 });
		queue.add({ execute: promiseFunctionResolve, priority: 60 });
		queue.add({ execute: promiseFunctionResolve, priority: 70 });
		queue.add({ execute: promiseFunctionResolve, priority: 80 });
		queue.add({ execute: promiseFunctionReject, priority: 10 });
		queue.add({ execute: promiseFunctionResolve, priority: 20 });
		queue.add({ execute: promiseFunctionResolve, priority: 20 });
		try {
			await queue.start();
		} catch (error) {
			expect(queue.queue).toStrictEqual([
				{ execute: promiseFunctionResolve, priority: 20, parameters: undefined },
				{ execute: promiseFunctionResolve, priority: 20, parameters: undefined },
				{ execute: promiseFunctionResolve, priority: 50, parameters: undefined },
				{ execute: promiseFunctionResolve, priority: 60, parameters: undefined },
				{ execute: promiseFunctionResolve, priority: 70, parameters: undefined },
				{ execute: promiseFunctionResolve, priority: 80, parameters: undefined },
			]);
		}
	});

	it('Test start case #5', async () => {
		const parameters = { item: { foo: "bar" } };
		const queue = new Queue();
		queue.add({
			execute: parameters => {
				return new Promise(resolve => {
					expect(parameters.item.foo).toBe("bar");
					parameters.item.foo = "foobar";
					resolve(true);
				});
			},
			priority: 50,
		});
		queue.add({
			execute: parameters => {
				return new Promise(resolve => {
					expect(parameters.item.foo).toBe("foobar");
					resolve(true);
				});
			},
			priority: 60,
		});
		await queue.start(parameters);
	});

	it('Test start case #6', async () => {
		const parameters = { item: { foo: "bar" } };
		const queue = new Queue();
		queue.add({
			execute: parameters => {
				return new Promise(resolve => {
					expect(parameters.item.foo).toBe("bar");
					parameters.item.foo = "foobar";
					resolve(true);
				});
			},
			priority: 50,
		}, parameters);
		queue.add({
			execute: parameters => {
				return new Promise(resolve => {
					expect(parameters.item.foo).toBe("foobar");
					resolve(true);
				});
			},
			priority: 60,
		}, parameters);
		await queue.start();
	});

	it('Test start case #7', async () => {
		const mockedFunction = jest.fn(parameters => {
			return new Promise(resolve => {
				expect(parameters.foo).toBe("bar");
				resolve(false);
			});
		});
		const queue = new Queue();
		queue.add({
			execute: mockedFunction,
			priority: 50,
		}, { foo: "bar" });
		queue.add({
			execute: mockedFunction,
			priority: 60,
		}, { foo: "bar" });
		await queue.start();
		expect(mockedFunction.mock.calls.length).toBe(1);
	});

	it('Test start case #8', async () => {
		const parameters = { foo: "bar" };
		const queue = new Queue();
		queue.add({
			execute: parameters => {
				return new Promise(resolve => {
					expect(parameters.foo).toBe("bar");
					parameters.foo = "foobar";
					resolve(true);
				});
			},
			priority: 50,
		});
		queue.add({
			execute: parameters => {
				return new Promise(resolve => {
					expect(parameters.foo).toBe("bar");
					resolve(true);
				});
			},
			priority: 60,
		});
		await queue.start(parameters);
	});

	it('Test start case #8', async () => {
		const queue = new Queue();
		queue.add({ execute: promiseFunctionResolve, priority: 50 });
		queue.add({ execute: promiseFunctionResolve, priority: 60 });
		queue.add({ execute: promiseFunctionResolve, priority: 70 });
		queue.add({ execute: promiseFunctionReject, priority: 80 });
		queue.add({ execute: promiseFunctionResolve, priority: 10 });
		queue.add({ execute: promiseFunctionResolve, priority: 20 });
		queue.add({ execute: promiseFunctionResolve, priority: 20 });
		await expect(queue.start(1, 2)).rejects.toThrow();
	});
});

