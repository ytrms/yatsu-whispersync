import type { AudioRange, Subtitle } from './general';

export function getMergedAudioRanges(subtitles: readonly (AudioRange & Pick<Subtitle, 'subIndex'>)[]): AudioRange[] {
	const ranges: AudioRange[] = [];
	let previousIndex: number | undefined;

	for (const { subIndex, startSeconds, endSeconds } of subtitles) {
		const lastRange = ranges[ranges.length - 1];

		if (lastRange && previousIndex !== undefined && subIndex === previousIndex + 1) {
			lastRange.startSeconds = Math.min(lastRange.startSeconds, startSeconds);
			lastRange.endSeconds = Math.max(lastRange.endSeconds, endSeconds);
		} else {
			ranges.push({ startSeconds, endSeconds });
		}

		previousIndex = subIndex;
	}

	return ranges;
}
