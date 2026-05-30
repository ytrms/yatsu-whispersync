import { describe, expect, it } from 'vitest';
import {
	baseLineCSSClass,
	between,
	caluclatePercentage,
	getBaseLineCSSSelectorForId,
	getDateString,
	getLineCSSSelector,
	getLineCSSSelectorForId,
	getSubtitleIdFromElement,
	getTimeParts,
	legacyBaseLineCSSClass,
	timeStringToSeconds,
	toTimeStamp,
	toTimeString,
} from './util';

describe('time helpers', () => {
	it('splits seconds into timestamp parts', () => {
		expect(getTimeParts(3723.045)).toEqual([1, 2, 3, 45]);
		expect(getTimeParts(1.9999)).toEqual([0, 0, 2, 0]);
		expect(getTimeParts(0)).toEqual([0, 0, 0, 0]);
	});

	it('formats SRT timestamps with millisecond precision', () => {
		expect(toTimeStamp(0)).toBe('00:00:00,000');
		expect(toTimeStamp(3723.045)).toBe('01:02:03,045');
		expect(toTimeStamp(61.5)).toBe('00:01:01,500');
		expect(toTimeStamp(1.9999)).toBe('00:00:02,000');
	});

	it('formats display time without milliseconds', () => {
		expect(toTimeString(0)).toBe('00:00:00');
		expect(toTimeString(3723.999)).toBe('01:02:03');
	});

	it('parses hh:mm:ss strings back into seconds', () => {
		expect(timeStringToSeconds('00:00:00')).toBe(0);
		expect(timeStringToSeconds('01:02:03')).toBe(3723);
		expect(timeStringToSeconds('10:00:05')).toBe(36005);
	});
});

describe('numeric helpers', () => {
	it('clamps values between lower and upper bounds', () => {
		expect(between(0, 10, -1)).toBe(0);
		expect(between(0, 10, 5)).toBe(5);
		expect(between(0, 10, 11)).toBe(10);
	});

	it('calculates percentages with either floor or two-decimal rounding', () => {
		expect(caluclatePercentage(0, 10)).toBe(0);
		expect(caluclatePercentage(1, 3)).toBe(33);
		expect(caluclatePercentage(1, 3, false)).toBe(33.33);
		expect(caluclatePercentage(2, 3, false)).toBe(66.67);
	});
});

describe('reader line CSS helpers', () => {
	it('uses the shared line highlight class prefix', () => {
		expect(baseLineCSSClass).toBe('yatsu-whispersync-line-highlight-');
		expect(legacyBaseLineCSSClass).toBe('ttu-whispersync-line-highlight-');
		expect(getLineCSSSelector()).toBe(
			"span[class^='yatsu-whispersync-line-highlight-'],span[class^='ttu-whispersync-line-highlight-']",
		);
		expect(getLineCSSSelectorForId('42')).toBe(
			'span.yatsu-whispersync-line-highlight-42,span.ttu-whispersync-line-highlight-42',
		);
		expect(getBaseLineCSSSelectorForId('42')).toBe('yatsu-whispersync-line-highlight-42');
	});

	it('reads subtitle ids from new and legacy line highlight classes', () => {
		const yatsuLine = { classList: ['yatsu-whispersync-line-highlight-42'] } as unknown as Element;
		const legacyLine = { classList: ['ttu-whispersync-line-highlight-43'] } as unknown as Element;

		expect(getSubtitleIdFromElement(yatsuLine)).toBe('42');
		expect(getSubtitleIdFromElement(legacyLine)).toBe('43');
	});
});

describe('date helpers', () => {
	it('formats local dates as yyyy-mm-dd', () => {
		expect(getDateString(new Date(2026, 4, 3))).toBe('2026-05-03');
		expect(getDateString(new Date(2026, 10, 30))).toBe('2026-11-30');
	});
});
