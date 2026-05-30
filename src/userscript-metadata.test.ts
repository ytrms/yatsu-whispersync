import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const userscriptConfigs = [
	{
		name: 'Violentmonkey',
		path: 'vite.vm.script.config.ts',
		output: 'yatsu-whispersync.user.js',
		updateUrl: 'https://github.com/ytrms/yatsu-whispersync/releases/latest/download/yatsu-whispersync.user.js',
	},
	{
		name: 'Tampermonkey',
		path: 'vite.tm.script.config.ts',
		output: 'yatsu-whispersync.tm.user.js',
		updateUrl: 'https://github.com/ytrms/yatsu-whispersync/releases/latest/download/yatsu-whispersync.tm.user.js',
	},
];

describe('userscript metadata', () => {
	for (const config of userscriptConfigs) {
		it(`keeps ${config.name} builds targeted at Yatsu`, () => {
			const source = readFileSync(resolve(process.cwd(), config.path), 'utf8');

			expect(source).toContain('const outName =');
			expect(source).toContain(config.output);
			expect(source).toContain('// @name        Yatsu Whispersync');
			expect(source).toContain('// @description Listen to audiobooks with Yatsu Reader');
			expect(source).toContain('// @match       https://app.yatsu.moe/*');
			expect(source).not.toContain('// @match       http://localhost:5173/*');
			expect(source).toContain('// @icon https://docs.yatsu.moe/assets/ya.svg');
			expect(source).toContain('// @homepageURL https://github.com/ytrms/yatsu-whispersync');
			expect(source).toContain(config.updateUrl);
		});
	}

	it('keeps upstream attribution in generated userscript headers', () => {
		const violentmonkeySource = readFileSync(resolve(process.cwd(), 'vite.vm.script.config.ts'), 'utf8');
		const tampermonkeySource = readFileSync(resolve(process.cwd(), 'vite.tm.script.config.ts'), 'utf8');

		for (const source of [violentmonkeySource, tampermonkeySource]) {
			expect(source).toContain('Yatsu Whispersync is adapted from ttu-whispersync');
			expect(source).toContain('https://github.com/Renji-XD/ttu-whispersync');
		}
	});
});
