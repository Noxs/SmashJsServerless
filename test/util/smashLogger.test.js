const Logger = require('../../lib/util/smashLogger.js');

describe('Logger', () => {
	it('Test logger instance', () => {
		const logger = new Logger();
		expect(logger).toBeObject();
	});

	it('Test logger log function', () => {
		const logger = new Logger();
		expect(logger.log).toBeFunction();
		expect(() => {
			logger.log("log");
		}).not.toThrow();
	});

	it('Test logger debug function', () => {
		const logger = new Logger();
		expect(logger.debug).toBeFunction();
		expect(() => {
			logger.debug("debug");
		}).not.toThrow();
	});

	it('Test logger info function', () => {
		const logger = new Logger();
		expect(logger.info).toBeFunction();
		expect(() => {
			logger.info("test");
		}).not.toThrow();
	});

	it('Test logger warn function', () => {
		const logger = new Logger();
		expect(logger.warn).toBeFunction();
		expect(() => {
			logger.warn("warn");
		}).not.toThrow();
	});

	it('Test logger error function', () => {
		const logger = new Logger();
		expect(logger.error).toBeFunction();
		expect(() => {
			logger.error("error");
		}).not.toThrow();
	});

	it('Test logger buildError()', () => {
		const logger = new Logger();

		expect(() => logger.buildError("test", 500)).not.toThrow();

		expect(() => logger.buildError()).not.toThrow();

		expect(() => logger.buildError("test")).not.toThrow();

		expect(() => logger.buildError(null, 200)).not.toThrow();

		const error = logger.buildError("test", 500);
		expect(error.constructor).toStrictEqual(Error);
	});
});
