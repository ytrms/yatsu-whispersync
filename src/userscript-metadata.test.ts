import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createUserscriptHeader, userscriptOutputs, type UserscriptManager } from '../userscript.metadata';

const userscriptConfigs = [
	{
		name: 'Violentmonkey',
		manager: 'violentmonkey',
		path: 'vite.vm.script.config.ts',
	},
	{
		name: 'Tampermonkey',
		manager: 'tampermonkey',
		path: 'vite.tm.script.config.ts',
	},
] satisfies { name: string; manager: UserscriptManager; path: string }[];

describe('userscript metadata', () => {
	for (const config of userscriptConfigs) {
		it(`keeps ${config.name} builds targeted at Yatsu`, () => {
			const source = readFileSync(resolve(process.cwd(), config.path), 'utf8');
			const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));
			const header = createUserscriptHeader(config.manager);
			const output = userscriptOutputs[config.manager].outName;

			expect(source).toContain(`defineUserscriptBuildConfig('${config.manager}')`);
			expect(output).toMatch(/^yatsu-whispersync.*\.user\.js$/);
			expect(header).toContain(`// @version     ${packageJson.version}`);
			expect(header).toContain('// @name        Yatsu Whispersync');
			expect(header).toContain('// @description Listen to audiobooks with Yatsu Reader');
			expect(header).toContain('// @match       https://app.yatsu.moe/*');
			expect(header).toContain('// @match       http://localhost:5173/*');
			expect(header).toContain('// @icon https://docs.yatsu.moe/assets/ya.svg');
			expect(header).toContain('// @homepageURL https://github.com/ytrms/yatsu-whispersync');
			expect(header).toContain(
				`https://github.com/ytrms/yatsu-whispersync/releases/latest/download/${output}`,
			);
		});
	}

	it('keeps upstream attribution in generated userscript headers', () => {
		for (const { manager } of userscriptConfigs) {
			const header = createUserscriptHeader(manager);

			expect(header).toContain('Original author: Renji-xD, with modifications by ytrms');
			expect(header).not.toContain('ryzusaku');
			expect(header).toContain('Yatsu Whispersync is adapted from ttu-whispersync');
			expect(header).toContain('https://github.com/Renji-XD/ttu-whispersync');
		}
	});
});
