import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { parseCLIArgs } from "./index.js";

describe("parseCLIArgs", () => {
	let originalArgv;

	beforeEach(() => {
		originalArgv = process.argv;
	});

	afterEach(() => {
		process.argv = originalArgv;
	});

	it("debería retornar null si hay menos de 2 argumentos", () => {
		process.argv = ["node", "index.js"];
		expect(parseCLIArgs()).toBeNull();

		process.argv = ["node", "index.js", "backend"];
		expect(parseCLIArgs()).toBeNull();
	});

	it("debería retornar null si el tipo de proyecto no es válido", () => {
		process.argv = ["node", "index.js", "invalid-type", "mi-proyecto"];
		expect(parseCLIArgs()).toBeNull();
	});

	it("debería parsear correctamente argumentos básicos de backend", () => {
		process.argv = ["node", "index.js", "backend", "mi-backend"];
		const result = parseCLIArgs();
		expect(result).not.toBeNull();
		expect(result.projectType).toBe("backend");
		expect(result.projectName).toBe("mi-backend");
		expect(result.pythonVersion).toBe("3.12");
		expect(result.installPipelines).toBe(true);
	});

	it("debería parsear correctamente la versión de python y deshabilitar pipelines si se indica", () => {
		process.argv = [
			"node",
			"index.js",
			"backend",
			"mi-backend",
			"--python",
			"3.13",
			"--no-pipelines",
		];
		const result = parseCLIArgs();
		expect(result).not.toBeNull();
		expect(result.pythonVersion).toBe("3.13");
		expect(result.installPipelines).toBe(false);
	});

	it("debería parsear correctamente argumentos básicos de frontend", () => {
		process.argv = ["node", "index.js", "frontend", "mi-frontend"];
		const result = parseCLIArgs();
		expect(result).not.toBeNull();
		expect(result.projectType).toBe("frontend");
		expect(result.projectName).toBe("mi-frontend");
		expect(result.installPipelines).toBe(true);
	});
});
