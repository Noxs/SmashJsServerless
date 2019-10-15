const SmashError = require("../../../util/smashError");
const errorUtil = new SmashError("Queue");

class Queue {
	constructor() {
		this.queue = [];
		this.parameters = null;
		this.resolve = null;
		this.reject = null;
		this.started = false;
	}

	add({ execute, priority }, parameters) {
		if (typeof execute !== 'function') {
			throw new errorUtil.TypeError("Property execute is not a function, prototype must be: queue.add({execute: function, priority: number}, parameters), ", execute);
		}
		if (typeof priority !== 'number') {
			throw new errorUtil.TypeError("Property priority is not a number, prototype must be: queue.add({execute: function, priority: number}, parameters), ", priority);
		}
		this.queue.push({ execute, priority, parameters });
		return this;
	}

	start(globalParameters) {
		return new Promise((resolve, reject) => {
			if (arguments.length > 1) {
				reject(new Error("queue.start(globalParameters) accept only one argument, " + arguments.length + " given"));
			}
			if (this.started === true) {
				reject(new Error("Queue already started."));
			} else if (this.queue.length < 1) {
				resolve(true);
			} else {
				this.started = true;
				this.parameters = globalParameters;
				this.resolve = resolve;
				this.reject = reject;
				this.queue.sort((item1, item2) => item1.priority - item2.priority);
				const { execute, parameters } = this.queue.shift();
				execute({ ...this.parameters, ...parameters }).then(result => this.continue(result)).catch(this.reject);
			}
		});
	}

	continue(result) {
		if (result) {
			if (this.queue.length === 0) {
				this.resolve(true);
			} else {
				const { execute, parameters } = this.queue.shift();
				execute({ ...this.parameters, ...parameters }).then(result => this.continue(result)).catch(this.reject);
			}
		} else {
			this.resolve(true);
		}
	}
}

module.exports = Queue;
