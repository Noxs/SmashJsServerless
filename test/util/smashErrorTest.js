const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const SmashError = require('../../lib/util/smashError.js');

describe('SmashError', function () {
	it('Test smashError instance', function () {
		const errorUtil = new SmashError();
		assert.isObject(errorUtil);
	});

	it('Test smashError Errors', function () {
		const errorUtil = new SmashError();
		assert.isObject(errorUtil.Errors);
		assert.containsAllKeys(errorUtil.Errors, [400, 401, 403, 409, 500, 501, 503]);
	});

	it('Test smashError getError', function () {
		const errorUtil = new SmashError();
		expect(function () {
			const error400 = errorUtil.getError(400);
			assert.equal(error400, errorUtil.Errors[400]);
			const error401 = errorUtil.getError(401);
			assert.equal(error401, errorUtil.Errors[401]);
			const error403 = errorUtil.getError(403);
			assert.equal(error403, errorUtil.Errors[403]);
			const error409 = errorUtil.getError(409);
			assert.equal(error409, errorUtil.Errors[409]);
			const error500 = errorUtil.getError(500);
			assert.equal(error500, errorUtil.Errors[500]);
			const error501 = errorUtil.getError(501);
			assert.equal(error501, errorUtil.Errors[501]);
			const error503 = errorUtil.getError(503);
			assert.equal(error503, errorUtil.Errors[503]);
		}).to.not.throw();

		expect(function () {
			const error42 = errorUtil.getError(42);
			assert.equal(error42, errorUtil.SmashError);
		}).to.not.throw();
	});

	it('Test smashError badRequestError with details', function () {
		const errorUtil = new SmashError();
		const error = errorUtil.badRequestError("Invalid body", { test: "FOOBAR" });
		assert.equal(error.code, 400);
		assert.deepEqual(error.body, { code: 400, error: "Invalid body", details: { test: "FOOBAR" }, requestId: undefined });

	});

	it('Test smashError badRequestError without details', function () {
		const errorUtil = new SmashError();
		const error = errorUtil.badRequestError("Invalid body");
		assert.equal(error.code, 400);
		assert.deepEqual(error.body, { code: 400, error: "Invalid body", requestId: undefined });
	});

	it('Test smashError unauthorizedError', function () {
		const errorUtil = new SmashError();
		const error = errorUtil.unauthorizedError("User is unauthorized");
		assert.equal(error.code, 401);
		assert.deepEqual(error.body, { code: 401, error: "Unauthorized", requestId: undefined });
	});

	it('Test smashError forbiddenError with message', function () {
		const errorUtil = new SmashError();
		const error = errorUtil.forbiddenError("Password does not match foobar");
		assert.equal(error.code, 403);
		assert.deepEqual(error.body, { code: 403, error: "Password does not match foobar", requestId: undefined });
	});

	it('Test smashError forbiddenError without message', function () {
		const errorUtil = new SmashError();
		const error = errorUtil.forbiddenError(null, "Password does not match foobar");
		assert.equal(error.code, 403);
		assert.deepEqual(error.body, { code: 403, error: "Forbidden", requestId: undefined });
	});

	it('Test smashError notFoundError', function () {
		const errorUtil = new SmashError();

		let error = errorUtil.notFoundError({ name: "User", primary: 42 });
		assert.equal(error.code, 404);
		assert.deepEqual(error.body, { code: 404, error: "User 42 not found", requestId: undefined });

		error = errorUtil.notFoundError({ name: "User" });
		assert.equal(error.code, 404);
		assert.deepEqual(error.body, { code: 404, error: "User not found", requestId: undefined });

		error = errorUtil.notFoundError({ name: "User", primary: 42, secondary: "foobar" });
		assert.equal(error.code, 404);
		assert.deepEqual(error.body, { code: 404, error: "User 42 - foobar not found", requestId: undefined });

		error = errorUtil.notFoundError();
		assert.equal(error.code, 404);
		assert.deepEqual(error.body, { code: 404, error: "Resource not found", requestId: undefined });
	});

	it('Test smashError conflictError', function () {
		const errorUtil = new SmashError();

		let error = errorUtil.conflictError({ name: "User", primary: 42 });
		assert.equal(error.code, 409);
		assert.deepEqual(error.body, { code: 409, error: "User 42 already exist", requestId: undefined });

		error = errorUtil.conflictError({ name: "User" });
		assert.equal(error.code, 409);
		assert.deepEqual(error.body, { code: 409, error: "User already exist", requestId: undefined });

		error = errorUtil.conflictError({ name: "User", primary: 42, secondary: "foobar" });
		assert.equal(error.code, 409);
		assert.deepEqual(error.body, { code: 409, error: "User 42 - foobar already exist", requestId: undefined });

		error = errorUtil.conflictError();
		assert.equal(error.code, 409);
		assert.deepEqual(error.body, { code: 409, error: "Resource already exist", requestId: undefined });
	});

	it('Test smashError internalServerError', function () {
		const errorUtil = new SmashError();
		const error = errorUtil.internalServerError("User is unauthorized");
		assert.equal(error.code, 500);
		assert.deepEqual(error.body, { code: 500, error: "Internal Server Error", requestId: undefined });
	});

	it('Test smashError notImplementedError', function () {
		const errorUtil = new SmashError();
		const error = errorUtil.notImplementedError("User is unauthorized");
		assert.equal(error.code, 501);
		assert.deepEqual(error.body, { code: 501, error: "Not Implemented", requestId: undefined });
	});

	it('Test smashError serviceUnavailableError', function () {
		const errorUtil = new SmashError();
		const error = errorUtil.serviceUnavailableError("User is unauthorized");
		assert.equal(error.code, 503);
		assert.deepEqual(error.body, { code: 503, error: "Service Unavailable", requestId: undefined });
	});

	it('Test smashError SmashError', function () {
		const errorUtil = new SmashError();
		const error = new errorUtil.SmashError();
		assert.instanceOf(error, errorUtil.SmashError);
	});

	it('Test smashError typeOf', function () {
		const errorUtil = new SmashError();
		const error1 = new errorUtil.SmashError();
		const error2 = new Error();
		const string = "a string";
		const number = 1;
		assert.equal(errorUtil.typeOf(string), "Type string given");
		assert.equal(errorUtil.typeOf(number), "Type number given");
		assert.equal(errorUtil.typeOf(error1, error2, string, number), "Type object / Class SmashError given, Type object / Class Error given, Type string given, Type number given");
	});

	it('Test smashError isSmashError', function () {
		const errorUtil = new SmashError();
		const error1 = new errorUtil.SmashError();
		assert.isTrue(errorUtil.isSmashError(error1));
		const error2 = new Error();
		assert.isFalse(errorUtil.isSmashError(error2));
	});

	it('Test smashError isBadRequestError', function () {
		const errorUtil = new SmashError();
		const error1 = errorUtil.badRequestError("Invalid body", { test: "FOOBAR" });
		assert.isTrue(errorUtil.isBadRequestError(error1));
		const error2 = new Error();
		assert.isFalse(errorUtil.isBadRequestError(error2));
	});

	it('Test smashError isUnauthorizedError', function () {
		const errorUtil = new SmashError();
		const error1 = errorUtil.unauthorizedError("User is unauthorized");
		assert.isTrue(errorUtil.isUnauthorizedError(error1));
		const error2 = new Error();
		assert.isFalse(errorUtil.isUnauthorizedError(error2));
	});

	it('Test smashError isForbiddenError', function () {
		const errorUtil = new SmashError();
		const error1 = errorUtil.forbiddenError("Password does not match foobar");
		assert.isTrue(errorUtil.isForbiddenError(error1));
		const error2 = new Error();
		assert.isFalse(errorUtil.isForbiddenError(error2));
	});

	it('Test smashError isNotFoundError', function () {
		const errorUtil = new SmashError();
		const error1 = errorUtil.notFoundError({ name: "User", primary: 42 });
		assert.isTrue(errorUtil.isNotFoundError(error1));
		const error2 = new Error();
		assert.isFalse(errorUtil.isNotFoundError(error2));
	});

	it('Test smashError isConflictError', function () {
		const errorUtil = new SmashError();
		const error1 = errorUtil.conflictError({ name: "User", primary: 42 });
		assert.isTrue(errorUtil.isConflictError(error1));
		const error2 = new Error();
		assert.isFalse(errorUtil.isConflictError(error2));
	});

	it('Test smashError isInternalServerError', function () {
		const errorUtil = new SmashError();
		const error1 = errorUtil.internalServerError("User is unauthorized");
		assert.isTrue(errorUtil.isInternalServerError(error1));
		const error2 = new Error();
		assert.isFalse(errorUtil.isInternalServerError(error2));
	});

	it('Test smashError isNotImplementedError', function () {
		const errorUtil = new SmashError();
		const error1 = errorUtil.notImplementedError("User is unauthorized");
		assert.isTrue(errorUtil.isNotImplementedError(error1));
		const error2 = new Error();
		assert.isFalse(errorUtil.isNotImplementedError(error2));
	});

	it('Test smashError isServiceUnavailableError', function () {
		const errorUtil = new SmashError();
		const error1 = errorUtil.serviceUnavailableError("User is unauthorized");
		assert.isTrue(errorUtil.isServiceUnavailableError(error1));
		const error2 = new Error();
		assert.isFalse(errorUtil.isServiceUnavailableError(error2));
	});
});
