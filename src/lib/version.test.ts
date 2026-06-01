import packageJson from '../../package.json';
import { describe, expect, it } from 'vitest';
import { scriptVersion } from './version';

describe('script version', () => {
	it('uses the package version', () => {
		expect(scriptVersion).toBe(packageJson.version);
	});
});
