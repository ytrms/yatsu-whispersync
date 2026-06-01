import { createWriteableStore } from './writeable-store';

export function writableBooleanStore() {
	return createWriteableStore(
		(x) => {
			if (x === '1' || x === 'true') {
				return true;
			}

			if (x === '0' || x === 'false') {
				return false;
			}

			throw new Error('Invalid boolean storage value');
		},
		(x) => (x ? '1' : '0'),
	);
}
