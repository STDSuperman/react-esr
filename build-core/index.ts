import type { InlineConfig, ResolvedConfig } from 'vite';
import type { OutputOptions, RollupOutput, OutputChunk } from "rollup";
import path from "path";
import { build, resolveConfig, defineConfig } from "vite";
import fs, { promises as fsPromise } from "fs";
import { build as esbuild } from "esbuild";
import replace from "@rollup/plugin-replace";
import { replace as esbuildReplace } from "esbuild-plugin-replace";
import { checkRelativeModulePrefix, normalizePathSeparator } from "./helper";
import { SERVER_OUTPUT_MODULE_PATH_NAME, CWD, mode } from './config'

const start = async () => {
	const viteConfig = await resolveConfig({}, "build", "production");
	const { clientViteConfig, buildResult } = await buildClient(viteConfig);
	const {
		serverViteConfig,
		htmlContent
	} = await buildServer(
		viteConfig,
		buildResult as RollupOutput,
		clientViteConfig
	);
	await generatePkgJson(viteConfig, clientViteConfig, serverViteConfig);
	await buildWorker(viteConfig, serverViteConfig, htmlContent);
};

const buildClient = async (viteConfig: ResolvedConfig) => {
	const distDir = viteConfig.build?.outDir
		?? path.resolve(CWD, "dist");
	const clientViteConfig = defineConfig({
		mode,
		build: {
			outDir: path.resolve(distDir, "client"),
			ssrManifest: true,
			emptyOutDir: false,
			target: "es2015",
			rollupOptions: {
				input: path.resolve(CWD, "src/entry.client.tsx"),
				// external: [
				// 	'react',
				// 	'react-dom'
				// ],
				// plugins: [
				// 	replace({
				// 		preventAssignment: true,
				// 		values: {
				// 			"jsx-dev-runtime": 'jsx-dev-runtime.js',
				// 			"jsx-runtime": 'jsx-runtime.js'
				// 		},
				// 	}),
				// ]
			}
		},
		// resolve: {
		// 	alias: {
		// 		react: path.resolve(CWD, 'node_modules/react'),
		// 		'react-dom': path.resolve(CWD, 'node_modules/react-dom'),
		// 	}
		// }
	}) as InlineConfig;
	const buildResult = await build(clientViteConfig);
	return {
		buildResult,
		clientViteConfig,
	};
};

const buildServer = async (
	viteConfig: ResolvedConfig,
	buildResult: RollupOutput,
	clientViteConfig: InlineConfig
) => {
	const distDir =
		viteConfig.build?.outDir ?? path.resolve(CWD, "dist");
	const entryFile = path.resolve(CWD, "src/entry.server.tsx");
	const serverOutputFile = path.resolve(distDir, "server");
	const htmlContent = JSON.stringify(
		generateHtmlContent(
			buildResult,
			clientViteConfig
		)
	);
	const serverViteConfig = {
		publicDir: "",
		ssr: {
			target: "node",
		},
		mode,
		build: {
			outDir: serverOutputFile,
			emptyOutDir: true,
			ssr: true,
			ssrManifest: false,
			target: "es2019",
			rollupOptions: {
				input: entryFile,
				output: {
					format: "es",
				},
				plugins: [
					replace({
						preventAssignment: true,
						values: {
							__HTML_CONTENT__: htmlContent
						},
					}),
				],
				// external: ["react", "react-dom"]
			}
		}
	} as InlineConfig;
	await build(serverViteConfig);
	return {
		serverViteConfig,
		htmlContent
	};
};

const generatePkgJson = async (
	viteConfig: ResolvedConfig,
	clientViteConfig: InlineConfig,
	serverViteConfig: InlineConfig
) => {
	const moduleFormat =
		(viteConfig?.build?.rollupOptions?.output as OutputOptions)?.format ||
		(serverViteConfig?.build?.rollupOptions?.output as OutputOptions)?.format;

	const packageJson = {
		main: "entry.server.js",
		type: /^esm?$/i.test(moduleFormat || "") ? "module" : "commonjs"
	};
	fsPromise.writeFile(
		path.join(serverViteConfig?.build?.outDir as string, "package.json"),
		JSON.stringify(packageJson, null, 2),
		"utf-8"
	);
};

const buildWorker = async (
	viteConfig: ResolvedConfig,
	serverViteConfig: InlineConfig,
	htmlContent: string
) => {
	const outputFilePath = path.resolve(
		viteConfig.build.outDir,
		"worker",
		"index.js"
	);
	esbuild({
		entryPoints: [path.resolve(CWD, "worker.ts")],
		format: "esm",
		target: "es2020",
		platform: "browser",
		outfile: outputFilePath,
		// @ts-ignore
		minify: mode === 'production',
		treeShaking: true,
		bundle: true,
		external: [SERVER_OUTPUT_MODULE_PATH_NAME],
		plugins: [
			esbuildReplace({
				[SERVER_OUTPUT_MODULE_PATH_NAME]: checkRelativeModulePrefix(
          normalizePathSeparator(
            path.relative(
              CWD,
              serverViteConfig?.build?.outDir as string
            )
          )
				),
				__HTML_CONTENT__: htmlContent
			}),
		],
	});
};

const generateHtmlContent = (
	clientBuildResult: RollupOutput,
	clientViteConfig: InlineConfig
) => {
	let indexHtmlContent = fs
		.readFileSync(path.resolve(CWD, "./index.html"))
		.toString();

	const assetDirPath = clientViteConfig?.build?.outDir || "/dist";

	const assets = clientBuildResult.output?.map((item) => {
		const filePath = normalizePathSeparator(path.relative(assetDirPath, item.fileName))
		if ((item as OutputChunk)?.isEntry) {
			return `<script type="module" src="${filePath}"></script>`;
		} else if (item.type === "chunk") {
			return `<script rel="modulepreload" crossorigin href="${filePath}"></script>`;
		} else if (
			item.type === "asset" &&
			!item.fileName.endsWith("manifest.json")
		) {
			return `<link rel="stylesheet" href="${filePath}">`;
		}
	});

	indexHtmlContent = indexHtmlContent.replace(
		/(\<\/head\>)/g,
		`${assets.join("")}$1`
	);
	return indexHtmlContent;
};

start();
