import { describe, expect, it } from 'vitest';
import { getAudioNormalizationGain, normalizeAudioChannels } from './audioNormalization';

describe('audio normalization', () => {
	it('boosts quiet audio toward the target rms', () => {
		const gain = getAudioNormalizationGain([new Float32Array([0.01, -0.01, 0.01, -0.01])]);

		expect(gain).toBeGreaterThan(1);
	});

	it('attenuates loud audio', () => {
		const gain = getAudioNormalizationGain([new Float32Array([0.6, -0.6, 0.6, -0.6])]);

		expect(gain).toBeLessThan(1);
	});

	it('limits gain to prevent clipping', () => {
		const gain = getAudioNormalizationGain([new Float32Array([0.01, -0.4])], {
			targetRms: 1,
			peakCeiling: 0.8,
			maxGain: 10,
		});

		expect(gain).toBeCloseTo(2);
	});

	it('applies bounded gain in place', () => {
		const channel = new Float32Array([0.5, -0.5]);
		const gain = normalizeAudioChannels([channel], { targetRms: 1, peakCeiling: 0.75, maxGain: 10 });

		expect(gain).toBe(1.5);
		expect(Array.from(channel)).toEqual([0.75, -0.75]);
	});

	it('leaves silence unchanged', () => {
		const channel = new Float32Array([0, 0, 0]);
		const gain = normalizeAudioChannels([channel]);

		expect(gain).toBe(1);
		expect(Array.from(channel)).toEqual([0, 0, 0]);
	});
});
