export const APP_PREFIX = 'yatsu-whispersync';
export const LEGACY_APP_PREFIX = 'ttu-whispersync';

export function getLegacyStorageKey(storageKey: string) {
	return storageKey.startsWith(`${APP_PREFIX}-`) ? storageKey.replace(APP_PREFIX, LEGACY_APP_PREFIX) : '';
}

export function migrateLocalStorageKey(storage: Storage, storageKey: string) {
	const stored = storage.getItem(storageKey);

	if (stored !== null) {
		return stored;
	}

	const legacyStorageKey = getLegacyStorageKey(storageKey);

	if (!legacyStorageKey) {
		return null;
	}

	const legacyStored = storage.getItem(legacyStorageKey);

	if (legacyStored !== null) {
		storage.setItem(storageKey, legacyStored);
	}

	return legacyStored;
}
