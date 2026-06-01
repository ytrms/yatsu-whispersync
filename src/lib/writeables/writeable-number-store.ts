import { createWriteableStore } from './writeable-store';

export function writableNumberStore() {
	return createWriteableStore<number>(
		(x) => {
			const value = Number.parseFloat(x);

			if (!Number.isFinite(value)) {
				throw new Error('Invalid number storage value');
			}

			return value;
		},
		(x) => `${x}`,
	);
}
