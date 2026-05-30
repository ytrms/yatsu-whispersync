import { describe, expect, it } from 'vitest';
import { getLegacyStorageKey, migrateLocalStorageKey } from './prefixes';

function createStorage(initialValues: Record<string, string> = {}) {
	const values = new Map(Object.entries(initialValues));

	return {
		get length() {
			return values.size;
		},
		clear() {
			values.clear();
		},
		getItem(key: string) {
			return values.get(key) ?? null;
		},
		key(index: number) {
			return [...values.keys()][index] ?? null;
		},
		removeItem(key: string) {
			values.delete(key);
		},
		setItem(key: string, value: string) {
			values.set(key, value);
		},
	} as Storage;
}

describe('storage prefix migration', () => {
	it('maps yatsu storage keys to their legacy ttu equivalent', () => {
		expect(getLegacyStorageKey('yatsu-whispersync-player-rewind-time')).toBe('ttu-whispersync-player-rewind-time');
		expect(getLegacyStorageKey('writingMode')).toBe('');
	});

	it('prefers existing yatsu storage values', () => {
		const storage = createStorage({
			'yatsu-whispersync-player-rewind-time': '7',
			'ttu-whispersync-player-rewind-time': '5',
		});

		expect(migrateLocalStorageKey(storage, 'yatsu-whispersync-player-rewind-time')).toBe('7');
		expect(storage.getItem('yatsu-whispersync-player-rewind-time')).toBe('7');
	});

	it('copies legacy ttu values when yatsu values are missing', () => {
		const storage = createStorage({
			'ttu-whispersync-player-rewind-time': '5',
		});

		expect(migrateLocalStorageKey(storage, 'yatsu-whispersync-player-rewind-time')).toBe('5');
		expect(storage.getItem('yatsu-whispersync-player-rewind-time')).toBe('5');
	});
});
