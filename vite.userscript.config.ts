import { dirname, join } from 'path';

import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { writeFileSync } from 'fs';
import type { OutputBundle } from 'rollup';
import { createUserscriptHeader, userscriptOutputs, type UserscriptManager } from './userscript.metadata';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function defineUserscriptBuildConfig(manager: UserscriptManager) {
	const { outDir, outName } = userscriptOutputs[manager];
	const filePath = join(__dirname, outDir, outName);

	return defineConfig((config) => {
		return {
			build: {
				outDir,
				emptyOutDir: true,
				lib: {
					name: 'yatsuWhispersync',
					entry: './src/content/content.ts',
					formats: ['iife'],
					fileName: () => outName,
				},
				minify: config.mode === 'production',
			},
			plugins: [
				nodePolyfills(),
				svelte({ emitCss: false }),
				viteSingleFile(),
				{
					name: 'copy-header',
					writeBundle(_, bundle) {
						writeFileSync(filePath, `${createUserscriptHeader(manager)}\n${getOutputCode(bundle, outName)}`, {
							encoding: 'utf-8',
						});
					},
				},
			],
		};
	});
}

function getOutputCode(bundle: OutputBundle, outName: string) {
	const output = bundle[outName];

	if (!output || output.type !== 'chunk') {
		throw new Error(`Expected userscript output chunk ${outName}`);
	}

	return output.code;
}
