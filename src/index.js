#!/usr/bin/env node

const prompts = require("prompts");
const fs = require("fs-extra");
const path = require("node:path");
const { execSync } = require("node:child_process");

// --- Modo no-interactivo para CI/CD ---
// Uso: cli-projects <type> <name> [--python 3.12] [--no-pipelines]
function parseCLIArgs() {
	const argv = process.argv.slice(2);
	if (argv.length < 2) return null;

	const [projectType, projectName] = argv;
	if (!["backend", "frontend"].includes(projectType)) return null;

	const pythonIdx = argv.indexOf("--python");
	const pythonVersion = pythonIdx !== -1 ? argv[pythonIdx + 1] : "3.12";
	const installPipelines = !argv.includes("--no-pipelines");

	// En modo no-interactivo se instalan todas las librerías por defecto
	const libraries = [
		"ruff",
		"mypy",
		"pydantic-settings",
		"sqlalchemy asyncpg",
		"alembic",
		"python-jose passlib[bcrypt]",
		"arq",
		"structlog",
		"pytest httpx",
	];

	return {
		projectType,
		projectName,
		pythonVersion,
		installPipelines,
		libraries,
	};
}

// Garantiza salida limpia al cancelar con Ctrl+C
const onCancel = () => {
	console.log("\n❌ Operación cancelada.");
	process.exit(0);
};

async function main() {
	console.log("🚀 ¡Bienvenido a tu generador de proyectos!\n");

	const cliArgs = parseCLIArgs();
	let answers;

	if (cliArgs) {
		answers = cliArgs;
		console.log(
			`⚡ Modo no interactivo: [${cliArgs.projectType}] → ${cliArgs.projectName}`,
		);
	} else {
		const questions = [
			{
				type: "select",
				name: "projectType",
				message: "¿Qué tipo de proyecto deseas inicializar?",
				choices: [
					{ title: "Backend (FastAPI + uv + SOLID)", value: "backend" },
					{ title: "Frontend (Next.js + Tailwind + Radix)", value: "frontend" },
				],
			},
			{
				type: (prev) => (prev === "backend" ? "select" : null),
				name: "pythonVersion",
				message: "Selecciona la versión de Python para el proyecto:",
				choices: [
					{ title: "3.12 (Recomendada - Máxima estabilidad)", value: "3.12" },
					{ title: "3.13", value: "3.13" },
					{ title: "3.14 (Última versión estable)", value: "3.14" },
				],
				initial: 0,
			},
			{
				type: (_prev, values) =>
					values.projectType === "backend" ? "multiselect" : null,
				name: "libraries",
				message:
					"Selecciona las librerías a instalar (Espacio para desmarcar):",
				choices: [
					{
						title: "ruff (Linter & Formatter ultra-rápido basado en Rust)",
						value: "ruff",
						selected: true,
					},
					{
						title: "mypy (Verificador de tipos estáticos estricto)",
						value: "mypy",
						selected: true,
					},
					{
						title: "pydantic-settings (Validación robusta de variables .env)",
						value: "pydantic-settings",
						selected: true,
					},
					{
						title: "sqlalchemy 2.0 & asyncpg (Acceso asíncrono a Postgres)",
						value: "sqlalchemy asyncpg",
						selected: true,
					},
					{
						title: "alembic (Gestión de migraciones de Base de Datos)",
						value: "alembic",
						selected: true,
					},
					{
						title: "python-jose & passlib[bcrypt] (Seguridad y Tokens JWT)",
						value: "python-jose passlib[bcrypt]",
						selected: true,
					},
					{
						title: "arq (Procesamiento de tareas pesadas/ML en segundo plano)",
						value: "arq",
						selected: true,
					},
					{
						title: "structlog (Logs profesionales estructurados en JSON)",
						value: "structlog",
						selected: true,
					},
					{
						title: "pytest & httpx (Suite completa de Testing asíncrono)",
						value: "pytest httpx",
						selected: true,
					},
				],
				hint: "- Espacio para seleccionar. Enter para confirmar.",
			},
			{
				type: "text",
				name: "projectName",
				message: "¿Cómo se llamará el proyecto?",
				initial: "mi-proyecto-moderno",
			},
			{
				type: "confirm",
				name: "installPipelines",
				message:
					"¿Integrar automáticamente las pipelines de CI/CD para GitHub Actions?",
				initial: true,
			},
		];

		answers = await prompts(questions, { onCancel });
	}

	if (!answers.projectType || !answers.projectName) {
		console.log("❌ Operación cancelada.");
		process.exit(1);
	}

	const targetDir = path.join(process.cwd(), answers.projectName);
	const templateDir = path.join(__dirname, "../templates", answers.projectType);

	try {
		console.log(`\n⏳ Creando estructura base en: ./${answers.projectName}...`);
		await fs.copy(templateDir, targetDir);

		if (answers.projectType === "backend") {
			const pythonVersion = answers.pythonVersion || "3.12";

			// Fijar la versión de Python
			await fs.writeFile(
				path.join(targetDir, ".python-version"),
				pythonVersion,
			);
			console.log(`✅ Versión de Python configurada: ${pythonVersion}`);

			// Escribir pyproject.toml con el nombre real del proyecto.
			// Esto evita el conflicto con 'uv init', que sobreescribiría la plantilla.
			const pyprojectContent = [
				"[project]",
				`name = "${answers.projectName}"`,
				'version = "0.1.0"',
				'description = "API moderna construida con FastAPI"',
				'readme = "README.md"',
				`requires-python = ">=${pythonVersion}"`,
				"dependencies = []",
				"",
			].join("\n");
			await fs.writeFile(
				path.join(targetDir, "pyproject.toml"),
				pyprojectContent,
			);

			// Instalar dependencias core — uv crea el .venv automáticamente leyendo .python-version
			console.log("⏳ Instalando dependencias Core (FastAPI)...");
			try {
				execSync("uv add fastapi uvicorn", {
					cwd: targetDir,
					stdio: "inherit",
				});
			} catch (_err) {
				console.error(
					"❌ Error al instalar dependencias con uv. ¿Está uv instalado?",
				);
				process.exit(1);
			}

			if (answers.libraries && answers.libraries.length > 0) {
				console.log("⏳ Instalando librerías seleccionadas...");
				const libsToInstall = answers.libraries.join(" ");
				execSync(`uv add ${libsToInstall}`, {
					cwd: targetDir,
					stdio: "inherit",
				});
			}
		}

		if (answers.installPipelines) {
			console.log("\n🔗 Vinculando con la CLI de Pipelines...");
			try {
				execSync(
					`npx pipelines-by-joakamakaka add --target=${targetDir} --type=${answers.projectType}`,
					{ stdio: "inherit" },
				);
				console.log("✅ Pipelines añadidas con éxito.");
			} catch {
				console.log(
					"⚠️  No se pudo ejecutar la CLI de pipelines. Asegúrate de tenerla publicada.",
				);
			}
		}

		console.log(`\n✨ ¡Proyecto ${answers.projectName} listo!`);
		console.log(`👉 Ejecuta: cd ${answers.projectName} && uv sync`);
	} catch (error) {
		console.error("❌ Error construyendo el proyecto:", error.message);
		process.exit(1);
	}
}

if (require.main === module) {
	main();
}

module.exports = {
	parseCLIArgs,
	main,
};
