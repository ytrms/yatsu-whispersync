import { afterEach, describe, expect, it } from 'vitest';
import { getDefaultSetting, type ActionListItem } from '../settings';
import { writeableArrayStore } from './writeable-object-store';
import { writableBooleanStore } from './writeable-boolean-store';
import { writableNumberStore } from './writeable-number-store';

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

function setWindowStorage(storage: Storage) {
	(globalThis as any).window = { localStorage: storage };
}

afterEach(() => {
	delete (globalThis as any).window;
});

describe('writeable localStorage-backed stores', () => {
	it('falls back to defaults and clears malformed JSON values', () => {
		const key = 'yatsu-whispersync-action-list-of-footer';
		const storage = createStorage({ [key]: 'not-json' });

		setWindowStorage(storage);

		const store = writeableArrayStore<ActionListItem>()(key);

		expect(store.get()).toEqual(getDefaultSetting(key));
		expect(storage.getItem(key)).toBeNull();
	});

	it('falls back to boolean defaults for invalid persisted values', () => {
		const key = 'yatsu-whispersync-reader-enable-auto-reload';
		const storage = createStorage({ [key]: 'invalid' });

		setWindowStorage(storage);

		const store = writableBooleanStore()(key);

		expect(store.get()).toBe(true);
		expect(storage.getItem(key)).toBeNull();
	});

	it('falls back to number defaults for invalid persisted values', () => {
		const key = 'yatsu-whispersync-player-rewind-time';
		const storage = createStorage({ [key]: 'not-a-number' });

		setWindowStorage(storage);

		const store = writableNumberStore()(key);

		expect(store.get()).toBe(5);
		expect(storage.getItem(key)).toBeNull();
	});
});
