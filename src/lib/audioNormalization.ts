export interface AudioNormalizationOptions {
	targetRms?: number;
	peakCeiling?: number;
	maxGain?: number;
	minGain?: number;
	silenceThreshold?: number;
}

const defaultNormalizationOptions = {
	targetRms: 0.14,
	peakCeiling: 0.98,
	maxGain: 8,
	minGain: 0.05,
	silenceThreshold: 0.000001,
} satisfies Required<AudioNormalizationOptions>;

export function getAudioNormalizationGain(
	channels: Float32Array[],
	options: AudioNormalizationOptions = {},
) {
	const { targetRms, peakCeiling, maxGain, minGain, silenceThreshold } = {
		...defaultNormalizationOptions,
		...options,
	};
	let peak = 0;
	let sumSquares = 0;
	let sampleCount = 0;

	for (let channelIndex = 0; channelIndex < channels.length; channelIndex += 1) {
		const channel = channels[channelIndex];

		for (let sampleIndex = 0; sampleIndex < channel.length; sampleIndex += 1) {
			const sample = Number.isFinite(channel[sampleIndex]) ? channel[sampleIndex] : 0;
			const magnitude = Math.abs(sample);

			peak = Math.max(peak, magnitude);
			sumSquares += sample * sample;
			sampleCount += 1;
		}
	}

	if (!sampleCount || peak <= silenceThreshold) {
		return 1;
	}

	const rms = Math.sqrt(sumSquares / sampleCount);

	if (rms <= silenceThreshold) {
		return 1;
	}

	const rmsGain = targetRms / rms;
	const peakGain = peakCeiling / peak;

	return Math.min(maxGain, Math.max(minGain, Math.min(rmsGain, peakGain)));
}

export function normalizeAudioChannels(
	channels: Float32Array[],
	options: AudioNormalizationOptions = {},
) {
	const { peakCeiling } = { ...defaultNormalizationOptions, ...options };
	const gain = getAudioNormalizationGain(channels, options);

	for (let channelIndex = 0; channelIndex < channels.length; channelIndex += 1) {
		const channel = channels[channelIndex];

		for (let sampleIndex = 0; sampleIndex < channel.length; sampleIndex += 1) {
			const sample = Number.isFinite(channel[sampleIndex]) ? channel[sampleIndex] : 0;

			channel[sampleIndex] = Math.max(-peakCeiling, Math.min(peakCeiling, sample * gain));
		}
	}

	return gain;
}
