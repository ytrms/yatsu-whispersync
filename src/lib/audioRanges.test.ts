import { describe, expect, it } from 'vitest';
import { getMergedAudioRanges } from './audioRanges';

describe('merged subtitle audio ranges', () => {
	it('plays overlapping neighboring subtitles once, including a nested cue', () => {
		expect(getMergedAudioRanges([
			{ subIndex: 0, startSeconds: 0.5, endSeconds: 2.5 },
			{ subIndex: 1, startSeconds: 1.5, endSeconds: 3.5 },
			{ subIndex: 2, startSeconds: 2, endSeconds: 3 },
		])).toEqual([{ startSeconds: 0.5, endSeconds: 3.5 }]);
	});

	it('keeps pauses between selected neighbors and cuts past unselected subtitles', () => {
		expect(getMergedAudioRanges([
			{ subIndex: 2, startSeconds: 1, endSeconds: 2 },
			{ subIndex: 3, startSeconds: 3, endSeconds: 4 },
			{ subIndex: 5, startSeconds: 6, endSeconds: 7 },
			{ subIndex: 6, startSeconds: 7, endSeconds: 8 },
		])).toEqual([
			{ startSeconds: 1, endSeconds: 4 },
			{ startSeconds: 6, endSeconds: 8 },
		]);
	});

	it('includes an earlier start when neighboring cue times were edited out of order', () => {
		expect(getMergedAudioRanges([
			{ subIndex: 0, startSeconds: 2, endSeconds: 3 },
			{ subIndex: 1, startSeconds: 1, endSeconds: 2.5 },
		])).toEqual([{ startSeconds: 1, endSeconds: 3 }]);
	});
});
