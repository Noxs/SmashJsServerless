const smash = require('../../smash');
const DynamodbModel = require("../../lib/util/dynamodbModel.js");
class TestEmpty extends DynamodbModel {
}

describe('DynamodbModel', () => {
	it('Test DynamodbModel instance', () => {
		expect(() => new DynamodbModel()).toThrow();
		expect(() => new TestEmpty()).toThrow();
		expect(() => new TestEmpty("testtable")).not.toThrow();
	});

	it('Test DynamodbModel get table ', () => {
		smash.boot({ verbose: { level: "disable" }, env: { ENV: "test" } });
		const model = new TestEmpty("testtable");
		expect(model.table).toBe("testtable_test");
		model.env = "TEST";
		expect(model.table).toBe("testtable_TEST");
		model.env = "dev";
		expect(model.table).toBe("testtable_dev");
	});
});
