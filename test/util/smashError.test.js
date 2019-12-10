const SmashError = require('../../lib/util/smashError.js');

describe('SmashError', () => {
	it('Test smashError instance', () => {
		const errorUtil = new SmashError();
		expect(errorUtil).toBeObject();
	});

	it('Test smashError Errors', () => {
		const errorUtil = new SmashError();
		expect(errorUtil.Errors).toContainKeys([400, 401, 403, 409, 500, 501, 503]);
	});

	it('Test smashError getError', () => {
		const errorUtil = new SmashError();
		expect(() => {
			const error400 = errorUtil.getError(400);
			expect(error400).toStrictEqual(errorUtil.Errors[400]);
			const error401 = errorUtil.getError(401);
			expect(error401).toStrictEqual(errorUtil.Errors[401]);
			const error403 = errorUtil.getError(403);
			expect(error403).toStrictEqual(errorUtil.Errors[403]);
			const error409 = errorUtil.getError(409);
			expect(error409).toStrictEqual(errorUtil.Errors[409]);
			const error500 = errorUtil.getError(500);
			expect(error500).toStrictEqual(errorUtil.Errors[500]);
			const error501 = errorUtil.getError(501);
			expect(error501).toStrictEqual(errorUtil.Errors[501]);
			const error503 = errorUtil.getError(503);
			expect(error503).toStrictEqual(errorUtil.Errors[503]);
		}).not.toThrow();

		expect(() => {
			const error42 = errorUtil.getError(42);
			expect(error42).toBe(errorUtil.SmashError);
		}).not.toThrow();
	});

	it('Test smashError badRequestError with details', () => {
		const errorUtil = new SmashError();
		const error = errorUtil.badRequestError("Invalid body", { test: "FOOBAR" });
		expect(error.code).toBe(400);
		expect(error.body).toStrictEqual({ code: 400, error: "Invalid body", details: { test: "FOOBAR" }, requestId: undefined });
	});

	it('Test smashError badRequestError without details', () => {
		const errorUtil = new SmashError();
		const error = errorUtil.badRequestError("Invalid body");
		expect(error.code).toBe(400);
		expect(error.body).toStrictEqual({ code: 400, error: "Invalid body", requestId: undefined });
	});

	it('Test smashError unauthorizedError', () => {
		const errorUtil = new SmashError();
		const error = errorUtil.unauthorizedError("User is unauthorized");
		expect(error.code).toBe(401);
		expect(error.body).toStrictEqual({ code: 401, error: "Unauthorized", requestId: undefined });
	});

	it('Test smashError forbiddenError with message', () => {
		const errorUtil = new SmashError();
		const error = errorUtil.forbiddenError("Password does not match foobar");
		expect(error.code).toBe(403);
		expect(error.body).toStrictEqual({ code: 403, error: "Password does not match foobar", requestId: undefined });
	});

	it('Test smashError forbiddenError without message', () => {
		const errorUtil = new SmashError();
		const error = errorUtil.forbiddenError(null, "Password does not match foobar");
		expect(error.code).toBe(403);
		expect(error.body).toStrictEqual({ code: 403, error: "Forbidden", requestId: undefined });
	});

	it('Test smashError notFoundError', () => {
		const errorUtil = new SmashError();

		let error = errorUtil.notFoundError({ name: "User", primary: 42 });
		expect(error.code).toBe(404);
		expect(error.body).toStrictEqual({ code: 404, error: "User 42 not found", details: { name: "User", primary: 42 }, requestId: undefined });

		error = errorUtil.notFoundError({ name: "User" });
		expect(error.code).toBe(404);
		expect(error.body).toStrictEqual({ code: 404, error: "User not found", details: { name: "User" }, requestId: undefined });

		error = errorUtil.notFoundError({ name: "User", primary: 42, secondary: "foobar" });
		expect(error.code).toBe(404);
		expect(error.body).toStrictEqual({ code: 404, error: "User 42 - foobar not found", details: { name: "User", primary: 42, secondary: "foobar" }, requestId: undefined });

		error = errorUtil.notFoundError();
		expect(error.code).toBe(404);
		expect(error.body).toStrictEqual({ code: 404, error: "Resource not found", requestId: undefined });
	});

	it('Test smashError conflictError', () => {
		const errorUtil = new SmashError();

		let error = errorUtil.conflictError({ name: "User", primary: 42 });
		expect(error.code).toBe(409);
		expect(error.body).toStrictEqual({ code: 409, error: "User 42 already exist", details: { name: "User", primary: 42 }, requestId: undefined });

		error = errorUtil.conflictError({ name: "User" });
		expect(error.code).toBe(409);
		expect(error.body).toStrictEqual({ code: 409, error: "User already exist", details: { name: "User" }, requestId: undefined });

		error = errorUtil.conflictError({ name: "User", primary: 42, secondary: "foobar" });
		expect(error.code).toBe(409);
		expect(error.body).toStrictEqual({ code: 409, error: "User 42 - foobar already exist", details: { name: "User", primary: 42, secondary: "foobar" }, requestId: undefined });

		error = errorUtil.conflictError();
		expect(error.code).toBe(409);
		expect(error.body).toStrictEqual({ code: 409, error: "Resource already exist", requestId: undefined });
	});

	it('Test smashError internalServerError', () => {
		const errorUtil = new SmashError();
		const error = errorUtil.internalServerError("User is unauthorized");
		expect(error.code).toBe(500);
		expect(error.body).toStrictEqual({ code: 500, error: "Internal Server Error", requestId: undefined });
	});

	it('Test smashError notImplementedError', () => {
		const errorUtil = new SmashError();
		const error = errorUtil.notImplementedError("User is unauthorized");
		expect(error.code).toBe(501);
		expect(error.body).toStrictEqual({ code: 501, error: "Not Implemented", requestId: undefined });
	});

	it('Test smashError serviceUnavailableError', () => {
		const errorUtil = new SmashError();
		const error = errorUtil.serviceUnavailableError("User is unauthorized");
		expect(error.code).toBe(503);
		expect(error.body).toStrictEqual({ code: 503, error: "Service Unavailable", requestId: undefined });
	});

	it('Test smashError SmashError', () => {
		const errorUtil = new SmashError();
		const error = new errorUtil.SmashError();
		expect(error).toBeInstanceOf(errorUtil.SmashError);
	});

	it('Test smashError typeOf', () => {
		const errorUtil = new SmashError();
		const error1 = new errorUtil.SmashError();
		const error2 = new Error();
		const string = "a string";
		const number = 1;
		expect(SmashError.typeOf(string)).toBe("type string given");
		expect(SmashError.typeOf(number)).toBe("type number given");
		expect(SmashError.typeOf(error1, error2, string, number)).toBe("type 'object' / class 'SmashError' given, type 'object' / class 'Error' given, type string given, type number given");
	});

	it('Test smashError isSmashError', () => {
		const errorUtil = new SmashError();
		const error1 = new errorUtil.SmashError();
		expect(SmashError.isSmashError(error1)).toBeTrue();
		const error2 = new Error();
		expect(SmashError.isSmashError(error2)).toBeFalse();
	});

	it('Test smashError isBadRequestError', () => {
		const errorUtil = new SmashError();
		const error1 = errorUtil.badRequestError("Invalid body", { test: "FOOBAR" });
		expect(errorUtil.isBadRequestError(error1)).toBeTrue();
		const error2 = new Error();
		expect(errorUtil.isBadRequestError(error2)).toBeFalse();
	});

	it('Test smashError isUnauthorizedError', () => {
		const errorUtil = new SmashError();
		const error1 = errorUtil.unauthorizedError("User is unauthorized");
		expect(errorUtil.isUnauthorizedError(error1)).toBeTrue();
		const error2 = new Error();
		expect(errorUtil.isUnauthorizedError(error2)).toBeFalse();
	});

	it('Test smashError isForbiddenError', () => {
		const errorUtil = new SmashError();
		const error1 = errorUtil.forbiddenError("Password does not match foobar");
		expect(errorUtil.isForbiddenError(error1)).toBeTrue();
		const error2 = new Error();
		expect(errorUtil.isForbiddenError(error2)).toBeFalse();
	});

	it('Test smashError isNotFoundError', () => {
		const errorUtil = new SmashError();
		const error1 = errorUtil.notFoundError({ name: "User", primary: 42 });
		expect(errorUtil.isNotFoundError(error1)).toBeTrue();
		const error2 = new Error();
		expect(errorUtil.isNotFoundError(error2)).toBeFalse();
	});

	it('Test smashError isConflictError', () => {
		const errorUtil = new SmashError();
		const error1 = errorUtil.conflictError({ name: "User", primary: 42 });
		expect(errorUtil.isConflictError(error1)).toBeTrue();
		const error2 = new Error();
		expect(errorUtil.isConflictError(error2)).toBeFalse();
	});

	it('Test smashError isInternalServerError', () => {
		const errorUtil = new SmashError();
		const error1 = errorUtil.internalServerError("User is unauthorized");
		expect(errorUtil.isInternalServerError(error1)).toBeTrue();
		const error2 = new Error();
		expect(errorUtil.isInternalServerError(error2)).toBeFalse();
	});

	it('Test smashError isNotImplementedError', () => {
		const errorUtil = new SmashError();
		const error1 = errorUtil.notImplementedError("User is unauthorized");
		expect(errorUtil.isNotImplementedError(error1)).toBeTrue();
		const error2 = new Error();
		expect(errorUtil.isNotImplementedError(error2)).toBeFalse();
	});

	it('Test smashError isServiceUnavailableError', () => {
		const errorUtil = new SmashError();
		const error1 = errorUtil.serviceUnavailableError("User is unauthorized");
		expect(errorUtil.isServiceUnavailableError(error1)).toBeTrue();
		const error2 = new Error();
		expect(errorUtil.isServiceUnavailableError(error2)).toBeFalse();
	});
});
