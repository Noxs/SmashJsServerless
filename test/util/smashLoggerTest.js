const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const Logger = require('../../lib/util/smashLogger.js');

describe('Logger', function () {
	it('Test logger instance', function () {
		const logger = new Logger();
		assert.isObject(logger);
	});

	it('Test logger log function', function () {
		const logger = new Logger();
		assert.isFunction(logger.log);
		expect(function () {
			logger.log("log");
		}).to.not.throw();
	});

	it('Test logger debug function', function () {
		const logger = new Logger();
		assert.isFunction(logger.debug);
		expect(function () {
			logger.debug("debug");
		}).to.not.throw();
	});

	it('Test logger info function', function () {
		const logger = new Logger();
		assert.isFunction(logger.info);
		expect(function () {
			logger.info("test");
		}).to.not.throw();
	});

	it('Test logger warn function', function () {
		const logger = new Logger();
		assert.isFunction(logger.warn);
		expect(function () {
			logger.warn("warn");
		}).to.not.throw();
	});

	it('Test logger error function', function () {
		const logger = new Logger();
		assert.isFunction(logger.error);
		expect(function () {
			logger.error("error");
		}).to.not.throw();
	});

	it('Test logger codes', function () {
		const logger = new Logger();
		const codes = {
			badRequest: 400,
			unauthorized: 401,
			forbidden: 403,
			notFound: 404,
			conflict: 409,
			internalServerError: 500,
			notImplemented: 501,
			serviceUnavailable: 502
		};
		assert.deepEqual(codes, logger.codes);
		assert.isFrozen(logger.codes);
	});

	it('Test logger buildError()', function () {
		const logger = new Logger();

		expect(function () {
			const error = logger.buildError("test", 500);
		}).to.not.throw();

		expect(function () {
			const error = logger.buildError();
		}).to.not.throw();

		expect(function () {
			const error = logger.buildError("test");
		}).to.not.throw();

		expect(function () {
			const error = logger.buildError(null, 200);
		}).to.not.throw();

		const error = logger.buildError("test", 500);
		assert.equal(error.constructor, Error);
	});
});
