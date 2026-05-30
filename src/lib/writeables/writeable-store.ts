import { getDefaultSetting, type Settings } from '../settings';
import { migrateLocalStorageKey } from '../prefixes';
import { writable } from 'svelte/store';

export function createWriteableStore<T>(mapFromString: (s: string) => T, mapToString: (t: T) => string) {
	return (storageKey: string, forcedDefault?: T) => {
		const defaultValue = forcedDefault ?? (getDefaultSetting(storageKey as keyof Settings) as T);
		const initValue = getStoredOrDefault()(storageKey, defaultValue, mapFromString);
		const { subscribe, set } = writable(initValue);

		function _set(value: T) {
			window.localStorage.setItem(storageKey, mapToString(value));

			set(value);
		}

		function _get() {
			let val = defaultValue;

			const unsub = subscribe((value: T) => (val = value));

			unsub();

			return val;
		}

		function key() {
			return storageKey as keyof Settings;
		}

		function reset() {
			_set(defaultValue);

			return defaultValue;
		}

		return {
			subscribe,
			set: _set,
			get: _get,
			key,
			reset,
		};
	};
}

function getStoredOrDefault() {
	return <T>(key: string, defaultVal: T, mapFn: (s: string) => T) => {
		const stored = migrateLocalStorageKey(window.localStorage, key);

		return stored !== null ? mapFn(stored) : defaultVal;
	};
}
