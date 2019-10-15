describe('ModuleLoader', () => {
	let ModuleLoader = null;

	beforeAll(() => {
		jest.resetAllMocks();
		ModuleLoader = require("../../../../lib/core/filter/util/moduleLoader");
	});

	beforeEach(() => {

	});

	it('Test constructor', () => {
		const moduleLoader = new ModuleLoader(__dirname + "/../../../../lib/core/filter/inRule/actions");
		expect(moduleLoader.modules.length).toBe(13);
	});

	it('Test getModuleByName case #1', () => {
		const moduleLoader = new ModuleLoader(__dirname + "/../../../../lib/core/filter/inRule/actions");
		expect(moduleLoader.getModuleByName("properties").name).toBe("properties");
	});

	it('Test getModuleByName case #2', () => {
		const moduleLoader = new ModuleLoader(__dirname + "/../../../../lib/core/filter/inRule/actions");
		expect(() => moduleLoader.getModuleByName("foorbar")).toThrow();
	});
});

